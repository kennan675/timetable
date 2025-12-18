import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Tesseract from 'tesseract.js';
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Upload, Loader2, BookOpen, Clock, Brain, CheckCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { extractSubjects, generateStudyPlan } from "@/services/gemini";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/contexts/AppContext";
import { Navigation } from "@/components/Navigation";

interface Subject {
  name: string;
  examDate: string;
}

interface StudyPlanResponse {
  summary: {
    total_days: number;
    intensity_level: string;
  };
  schedule: Array<{
    date: string;
    tasks: Array<{
      subject: string;
      duration_minutes: number;
      topic_focus: string;
      priority: "high" | "medium" | "low";
      study_type: string;
    }>;
  }>;
  pro_tips: string[];
}

export default function StudyArchitect() {
  const navigate = useNavigate();
  const { setStudyPlan, setSubjects: setGlobalSubjects } = useAppContext();

  // Step 1: Input, Step 2: Priority Selection, Step 3: Results
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  // Step 1 data
  const [examData, setExamData] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [availability, setAvailability] = useState("4 hours on weekdays, 8 on weekends");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());

  // Step 2 data
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [finalExamData, setFinalExamData] = useState("");

  // Step 3 data
  const [plan, setPlan] = useState<StudyPlanResponse | null>(null);

  const { toast } = useToast();

  // Step 1: Analyze and extract subjects
  const handleAnalyze = async () => {
    if ((!examData && !imageFile) || !startDate) {
      toast({
        title: "Missing Information",
        description: "Please provide exam data and a start date.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      let combinedExamData = examData;

      if (imageFile) {
        setLoadingMessage("Reading image with OCR...");
        toast({ title: "Reading Image...", description: "Extracting text from your timetable." });

        const { data: { text } } = await Tesseract.recognize(imageFile, 'eng');
        console.log("OCR Result:", text);
        combinedExamData += `\n\n[Extracted from Image]:\n${text}`;
      }

      setFinalExamData(combinedExamData);
      setLoadingMessage("AI is analyzing your subjects...");

      const result = await extractSubjects(combinedExamData);
      setSubjects(result.subjects || []);
      setSelectedPriorities([]); // Reset selections
      setStep(2);
    } catch (error) {
      console.error("Analysis Error:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  // Step 2: Generate plan with selected priorities
  const handleGeneratePlan = async () => {
    setLoading(true);
    setLoadingMessage("Generating your optimized study plan...");

    try {
      const result = await generateStudyPlan({
        examData: finalExamData,
        availability,
        startDate: startDate!.toISOString().split('T')[0],
        highPrioritySubjects: selectedPriorities,
      });

      // Save to global context
      setStudyPlan(result);
      setGlobalSubjects(subjects);

      // Navigate to timetable page
      navigate('/study-timetable');
    } catch (error) {
      console.error("Generation Error:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const togglePriority = (subjectName: string) => {
    setSelectedPriorities(prev =>
      prev.includes(subjectName)
        ? prev.filter(s => s !== subjectName)
        : [...prev, subjectName]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4 md:p-8">
      <Navigation />
      <div className="max-w-4xl mx-auto space-y-8 py-8">
        <header className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/10 mb-4">
            <Brain className="w-8 h-8 text-purple-300" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            AI Study Architect
          </h1>
          <p className="text-blue-200 max-w-lg mx-auto">
            Transform messy exam schedules into optimized, stress-free study plans.
          </p>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 pt-4">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                  step >= s ? "bg-yellow-400 text-blue-900" : "bg-white/20 text-white/50"
                )}>
                  {s}
                </div>
                {s < 2 && <div className={cn("w-12 h-1 mx-1", step > s ? "bg-yellow-400" : "bg-white/20")} />}
              </div>
            ))}
          </div>
        </header>

        <AnimatePresence mode="wait">
          {/* STEP 1: Input Exam Data */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid gap-6"
            >
              <Card className="border border-white/20 shadow-lg bg-white/5 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-white">Step 1: Enter Your Exam Schedule</CardTitle>
                  <CardDescription className="text-blue-200">Paste your timetable or upload an image.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-white">Exam Data</Label>
                    <Textarea
                      placeholder="e.g., Math on Dec 20, Physics on Dec 22, Chemistry on Dec 25..."
                      className="min-h-[100px] resize-none bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      value={examData}
                      onChange={(e) => setExamData(e.target.value)}
                    />
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-white/20" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-blue-900 px-2 text-blue-200">Or upload an image</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Input
                        type="file"
                        accept="image/*"
                        className="cursor-pointer bg-white/10 border-white/20 text-white file:bg-yellow-400 file:text-blue-900 file:border-0 file:mr-4 file:py-2 file:px-4"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setImageFile(file);
                        }}
                      />
                      {imageFile && (
                        <span className="text-sm text-green-400 font-medium flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> Attached
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-white">Daily Availability</Label>
                      <Input
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value)}
                        placeholder="e.g., 4 hours weekdays, 8 weekends"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20",
                              !startDate && "text-white/50"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full text-lg font-semibold h-12 bg-yellow-400 hover:bg-yellow-500 text-blue-900"
                    onClick={handleAnalyze}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {loadingMessage || "Analyzing..."}
                      </>
                    ) : (
                      <>
                        Analyze Subjects <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* STEP 2: Priority Selection */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid gap-6"
            >
              <Card className="border border-white/20 shadow-lg bg-white/5 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-white">Step 2: Select High Priority Subjects</CardTitle>
                  <CardDescription className="text-blue-200">
                    We found {subjects.length} subjects. Check the ones you want to prioritize (more study time).
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {subjects.length === 0 ? (
                    <p className="text-center text-blue-200 py-8">No subjects found. Please go back and try again.</p>
                  ) : (
                    <div className="grid gap-3">
                      {subjects.map((subject, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
                            selectedPriorities.includes(subject.name)
                              ? "border-yellow-400 bg-yellow-400/10"
                              : "border-white/20 hover:border-white/40 bg-white/5"
                          )}
                          onClick={() => togglePriority(subject.name)}
                        >
                          <Checkbox
                            checked={selectedPriorities.includes(subject.name)}
                            onCheckedChange={() => togglePriority(subject.name)}
                            className="border-white/40 data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400"
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-lg text-white">{subject.name}</div>
                            <div className="text-sm text-blue-200">Exam: {subject.examDate}</div>
                          </div>
                          {selectedPriorities.includes(subject.name) && (
                            <span className="text-xs font-bold text-yellow-400 bg-yellow-400/20 px-2 py-1 rounded">
                              HIGH PRIORITY
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1 border-white/20 text-white hover:bg-white/10">
                      ← Back
                    </Button>
                    <Button
                      size="lg"
                      className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-blue-900"
                      onClick={handleGeneratePlan}
                      disabled={loading || subjects.length === 0}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          {loadingMessage || "Generating..."}
                        </>
                      ) : (
                        <>
                          Generate Plan <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* STEP 3: Results */}
          {step === 3 && plan && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-primary">Total Days</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{plan.summary.total_days}</div>
                  </CardContent>
                </Card>
                <Card className="bg-purple-500/5 border-purple-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-purple-600 dark:text-purple-400">Intensity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{plan.summary.intensity_level}</div>
                  </CardContent>
                </Card>
                <Card className="md:col-span-3 lg:col-span-1 bg-blue-500/5 border-blue-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-blue-600 dark:text-blue-400">Next Action</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm font-medium">Start with {plan.schedule[0]?.tasks[0]?.subject || "Review"}</div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                {plan.schedule.map((day, idx) => (
                  <motion.div
                    key={day.date}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="overflow-hidden border-l-4 border-l-primary hover:shadow-md transition-shadow">
                      <div className="p-4 md:p-6 grid md:grid-cols-[150px_1fr] gap-4 md:gap-8 items-start">
                        <div className="space-y-1">
                          <div className="text-2xl font-bold text-slate-700 dark:text-slate-200">
                            {format(new Date(day.date), "MMM d")}
                          </div>
                          <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                            {format(new Date(day.date), "EEEE")}
                          </div>
                        </div>

                        <div className="space-y-4">
                          {day.tasks.map((task, tIdx) => (
                            <div key={tIdx} className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 grid gap-2">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                  {task.subject}
                                  <span className={cn(
                                    "text-xs px-2 py-0.5 rounded-full border",
                                    task.priority === 'high' ? "bg-red-100 text-red-700 border-red-200" :
                                      task.priority === 'medium' ? "bg-yellow-100 text-yellow-700 border-yellow-200" :
                                        "bg-green-100 text-green-700 border-green-200"
                                  )}>
                                    {task.priority}
                                  </span>
                                </h3>
                                <div className="text-sm text-slate-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {task.duration_minutes}m
                                </div>
                              </div>
                              <p className="text-slate-600 dark:text-slate-300">{task.topic_focus}</p>
                              <div className="flex gap-2 mt-2">
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                                  <BookOpen className="w-3 h-3" />
                                  {task.study_type}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="grid gap-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  Pro Tips
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {plan.pro_tips.map((tip, idx) => (
                    <Card key={idx} className="bg-purple-50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/50">
                      <CardContent className="p-4 text-sm text-purple-900 dark:text-purple-100">
                        {tip}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex justify-center pt-8">
                <Button variant="outline" onClick={() => setStep(1)} className="mr-4">
                  Start Over
                </Button>
                <Button onClick={() => window.print()}>
                  Export / Print
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
