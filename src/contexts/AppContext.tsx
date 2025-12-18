import React, { createContext, useContext, useState } from 'react';

// Types for study plan
interface StudyTask {
  subject: string;
  duration_minutes: number;
  topic_focus: string;
  priority: "high" | "medium" | "low";
  study_type: string;
}

interface ScheduleDay {
  date: string;
  tasks: StudyTask[];
}

interface StudyPlan {
  summary: {
    total_days: number;
    intensity_level: string;
  };
  schedule: ScheduleDay[];
  pro_tips: string[];
}

interface Subject {
  name: string;
  examDate: string;
}

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;

  // Study Plan State
  studyPlan: StudyPlan | null;
  setStudyPlan: (plan: StudyPlan | null) => void;
  subjects: Subject[];
  setSubjects: (subjects: Subject[]) => void;

  // Helper to get first exam date for countdown
  getFirstExamDate: () => Date | null;
}

const defaultAppContext: AppContextType = {
  sidebarOpen: false,
  toggleSidebar: () => { },
  studyPlan: null,
  setStudyPlan: () => { },
  subjects: [],
  setSubjects: () => { },
  getFirstExamDate: () => null,
};

const AppContext = createContext<AppContextType>(defaultAppContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const getFirstExamDate = (): Date | null => {
    if (subjects.length === 0) return null;

    const validDates = subjects
      .map(s => s.examDate)
      .filter(d => d !== 'TBD')
      .map(d => new Date(d))
      .filter(d => !isNaN(d.getTime()))
      .sort((a, b) => a.getTime() - b.getTime());

    return validDates.length > 0 ? validDates[0] : null;
  };

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        studyPlan,
        setStudyPlan,
        subjects,
        setSubjects,
        getFirstExamDate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
