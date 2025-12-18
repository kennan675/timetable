export interface Exam {
  unitCode: string;
  unitName: string;
  date: string;
  time: string;
  venue: string;
  lecturer: string;
  color: string;
}

export interface StudySession {
  date: number;
  sessions: { time: string; unit: string }[];
  isWeekend: boolean;
}

export const exams: Exam[] = [
  // User data will be populated here by AI integration in the future
];

export const unitColors: Record<string, string> = {
  'RBCS 7212': '#93c5fd',
  'RBCS 7222': '#c4b5fd',
  'RBFC 7211': '#fda4af',
  'RBCS 7325': '#fcd34d',
  'RBCS 7315': '#86efac',
  'RBCS 7221': '#fbbf24'
};
