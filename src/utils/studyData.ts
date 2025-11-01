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
  { unitCode: 'RBCS 7212', unitName: 'Fundamentals of Computer Networks', date: 'Tue, Dec 2, 2025', time: '2:10 PM – 4:10 PM', venue: '1/3', lecturer: 'J. Mwangi', color: '#93c5fd' },
  { unitCode: 'RBCS 7222', unitName: 'Object Oriented Analysis and Design', date: 'Wed, Dec 3, 2025', time: '9:00 AM – 11:00 AM', venue: '3/13', lecturer: 'P. Mwaniki', color: '#c4b5fd' },
  { unitCode: 'RBFC 7211', unitName: 'Entrepreneurship and Innovation', date: 'Wed, Dec 3, 2025', time: '11:05 AM – 2:05 PM', venue: '2/3', lecturer: 'A. Nyaga / S. Mulei', color: '#fda4af' },
  { unitCode: 'RBCS 7325', unitName: 'System Development Methodologies', date: 'Thu, Dec 4, 2025', time: '11:30 AM – 1:30 PM', venue: 'G/15', lecturer: 'J. Mwangi', color: '#fcd34d' },
  { unitCode: 'RBCS 7315', unitName: 'Distributed Systems', date: 'Fri, Dec 5, 2025', time: '9:00 AM – 11:00 AM', venue: '1/5', lecturer: 'J. Sirma', color: '#86efac' },
  { unitCode: 'RBCS 7221', unitName: 'Web Application Development 1', date: 'Mon, Dec 8, 2025', time: '2:10 PM – 4:10 PM', venue: 'G/15', lecturer: 'P. Mwaniki', color: '#fbbf24' }
];

export const unitColors: Record<string, string> = {
  'RBCS 7212': '#93c5fd',
  'RBCS 7222': '#c4b5fd',
  'RBFC 7211': '#fda4af',
  'RBCS 7325': '#fcd34d',
  'RBCS 7315': '#86efac',
  'RBCS 7221': '#fbbf24'
};
