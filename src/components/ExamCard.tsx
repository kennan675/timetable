import type { FC } from 'react';
import { Exam } from '../utils/studyData';

interface ExamCardProps {
  exam: Exam;
  index: number;
}

export const ExamCard: FC<ExamCardProps> = ({ exam, index }) => {
  return (
    <div 
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-l-4"
      style={{ borderLeftColor: exam.color, animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{exam.unitCode}</h3>
          <p className="text-gray-600 text-sm mt-1">{exam.unitName}</p>
        </div>
        <div className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: exam.color }}>
          Exam {index + 1}
        </div>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700">Date:</span>
          <span className="text-gray-600">{exam.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700">Time:</span>
          <span className="text-gray-600">{exam.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700">Venue:</span>
          <span className="text-gray-600">{exam.venue}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700">Lecturer:</span>
          <span className="text-gray-600">{exam.lecturer}</span>
        </div>
      </div>
    </div>
  );
};
