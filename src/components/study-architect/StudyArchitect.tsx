import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Upload, Loader2, BookOpen, Clock, Brain, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateStudyPlan } from "@/services/gemini";
import { useToast } from "@/hooks/use-toast";

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
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [examData, setExamData] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [availability, setAvailability] = useState("4 hours on weekdays, 8 on weekends");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [plan, setPlan] = useState<StudyPlanResponse | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
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
      const result = await generateStudyPlan({
        examData,
        availability,
        startDate: startDate.toISOString().split('T')[0],
        image: imageFile,
      });
      setPlan(result);
      setStep(2);
    } catch (error) {
      console.error("Study Architect Error:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 md:p-8 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 mb-4">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            AI Study Architect
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            Transform messy exam schedules into optimized, stress-free study plans using cognitive science.
          </p>
        </header>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid gap-6"
            >
              <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
                <CardHeader>
                  <CardTitle>Configure Your Plan</CardTitle>
                  <CardDescription>Tell us about your exams and availability.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Raw Exam Data</Label>
                    <Textarea
                      placeholder="Paste your exam schedule here (e.g., 'Math on Dec 20, Physics on Dec 22')..."
                      className="min-h-[100px] resize-none"
                      value={examData}
                      onChange={(e) => setExamData(e.target.value)}
                    />
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-slate-900 px-2 text-muted-foreground">Or upload an image</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Input
                        type="file"
                        accept="image/*"
                        className="cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setImageFile(file);
                        }}
                      />
                      {imageFile && (
                        <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> Attached
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Daily Availability</Label>
                      <Input
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value)}
                        placeholder="e.g., 4 hours weekdays, 8 weekends"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !startDate && "text-muted-foreground"
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
                    className="w-full text-lg font-semibold h-12 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300 shadow-lg hover:shadow-primary/25"
                    onClick={handleGenerate}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing Timetable...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-5 w-5" />
                        Generate Optimized Plan
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 2 && plan && (
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
                            <div key={tIdx} className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 grid gap-2 relative group">
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
                  Adjust Inputs
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
