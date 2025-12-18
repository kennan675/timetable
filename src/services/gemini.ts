import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
// Note: In a real production app, this should be a backend call to protect the API key.
// For this portfolio/demo, we'll use a public-facing key or environment variable.
const genAI = new GoogleGenerativeAI("AIzaSyAtWWL08-vLKMu1And_p2rFku5yZ3_0GiI");

const MODEL_NAME = "gemini-1.5-pro";

interface GeneratePlanParams {
  examData: string;
  availability: string;
  startDate: string;
}

export const generateStudyPlan = async ({ examData, availability, startDate }: GeneratePlanParams) => {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const prompt = `
### ROLE
You are the "AI Study Architect," a high-performance educational consultant specializing in cognitive science and spaced repetition. Your goal is to transform messy exam schedules into optimized, stress-free study plans.

### INPUT DATA
1. **Raw Exam Data:** ${examData}
2. **Daily Availability:** ${availability}
3. **Current Date:** ${startDate}
4. **Subject Weights:** Infer the weights based on the exam data context or assign default (3) if unsure.

### LOGIC CONSTRAINTS
- **Prioritize the "Weak" or "Hard":** Critical subjects receive more study slots.
- **Tapering:** Increase intensity as the exam date approaches, but include 1 "Buffer Day" before each exam for pure revision.
- **Spaced Repetition:** Never schedule the same subject for 8 hours straight. Mix subjects to prevent "Blocked Practice" fatigue.
- **Buffer:** Ensure a 15-minute break is suggested every 90 minutes of study.

### OUTPUT FORMAT (JSON ONLY)
You must return a valid JSON object. Do not include prose or explanations. 

Schema:
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
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up markdown code blocks if present
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
