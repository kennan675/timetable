import Groq from "groq-sdk";

// Initialize Groq
const apiKey = import.meta.env.VITE_GROQ_API_KEY;
if (!apiKey) {
  console.error("Missing Groq API Key. Make sure VITE_GROQ_API_KEY is set in .env");
}

const groq = new Groq({
  apiKey: apiKey || "",
  dangerouslyAllowBrowser: true,
});

const MODEL_NAME = "llama-3.3-70b-versatile";

// Step 1: Extract subjects from exam data
export const extractSubjects = async (examData: string): Promise<{ subjects: Array<{ name: string; examDate: string }> }> => {
  if (!import.meta.env.VITE_GROQ_API_KEY) {
    throw new Error("API Key missing. Please check your .env file and restart the server.");
  }

  const prompt = `
### TASK
Extract all subjects/units from the following exam schedule data. For each subject, identify the exam date if available.

### INPUT
${examData}

### OUTPUT FORMAT (JSON ONLY)
Return a JSON object with this exact schema:
{
  "subjects": [
    { "name": "Subject Name", "examDate": "YYYY-MM-DD or 'TBD'" }
  ]
}
Do not include any explanation, only the JSON.
`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: MODEL_NAME,
      temperature: 0.3,
      max_tokens: 1024,
      response_format: { type: "json_object" },
    });

    const text = chatCompletion.choices[0]?.message?.content || "";
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Groq API Error (extractSubjects):", error);
    throw error;
  }
};

// Step 2: Generate study plan with user-selected priorities
interface GeneratePlanParams {
  examData: string;
  availability: string;
  startDate: string;
  highPrioritySubjects: string[];
}

export const generateStudyPlan = async ({ examData, availability, startDate, highPrioritySubjects }: GeneratePlanParams) => {
  if (!import.meta.env.VITE_GROQ_API_KEY) {
    throw new Error("API Key missing. Please check your .env file and restart the server.");
  }

  const priorityList = highPrioritySubjects.length > 0
    ? `The user has marked these subjects as HIGH PRIORITY (give them more study time): ${highPrioritySubjects.join(", ")}`
    : "No specific priorities set by user. Use your judgment based on exam proximity.";

  const prompt = `
### ROLE
You are the "AI Study Architect," a high-performance educational consultant specializing in cognitive science and spaced repetition.

### INPUT DATA
1. **Exam Schedule:** ${examData}
2. **Daily Availability:** ${availability}
3. **Start Date:** ${startDate}
4. **User Priorities:** ${priorityList}

### LOGIC CONSTRAINTS
- **High Priority subjects get 40% more study time** than others.
- **Tapering:** Increase intensity as the exam date approaches, include 1 "Buffer Day" before each exam.
- **Spaced Repetition:** Never schedule the same subject for 8 hours straight.
- **Breaks:** 15-minute break every 90 minutes.

### OUTPUT FORMAT (JSON ONLY)
{
  "summary": { "total_days": number, "intensity_level": "string" },
  "schedule": [
    {
      "date": "YYYY-MM-DD",
      "tasks": [
        {
          "subject": "string",
          "duration_minutes": number,
          "topic_focus": "string",
          "priority": "high|medium|low",
          "study_type": "Deep Work|Active Recall|Flashcards|Past Paper"
        }
      ]
    }
  ],
  "pro_tips": ["string"]
}
`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: MODEL_NAME,
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: "json_object" },
    });

    const text = chatCompletion.choices[0]?.message?.content || "";
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Groq API Error:", error);
    throw error;
  }
};
