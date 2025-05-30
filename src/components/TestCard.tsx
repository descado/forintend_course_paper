import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, BarChart } from 'lucide-react';
import { Test } from '../types';

interface TestCardProps {
  test: Test;
}

const TestCard: React.FC<TestCardProps> = ({ test }) => {
  return (
    <div className="card hover:border-red-500 hover:border transition-all duration-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{test.title}</h3>
      <div className="flex items-center text-sm text-gray-600 mb-2 space-x-4">
        <span className="inline-flex items-center">
          <Clock size={16} className="mr-1" />
          {test.timeLimit ? `${test.timeLimit} min` : 'No time limit'}
        </span>
        <span className="inline-flex items-center">
          <BarChart size={16} className="mr-1" />
          {test.difficulty.charAt(0).toUpperCase() + test.difficulty.slice(1)}
        </span>
      </div>
      <p className="text-gray-600 mb-4 line-clamp-2">{test.description}</p>
      <div className="flex items-center justify-between">
        <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
          {test.category}
        </span>
        <Link
          to={`/tests/${test.id}`}
          className="btn btn-outline text-sm"
        >
          Take Test
        </Link>
      </div>
    </div>
  );
};

export default TestCard;