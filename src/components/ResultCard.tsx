import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, Award } from 'lucide-react';
import { TestResult, Test } from '../types';

interface ResultCardProps {
  result: TestResult;
  test: Test;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, test }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="card hover:border-red-500 hover:border transition-all duration-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{test.title}</h3>
      <div className="flex items-center text-sm text-gray-600 mb-4 space-x-4">
        <span className="inline-flex items-center">
          <CheckCircle size={16} className="mr-1" />
          {formatDate(result.date)}
        </span>
        <span className="inline-flex items-center">
          <Clock size={16} className="mr-1" />
          {formatTime(result.timeTaken)}
        </span>
      </div>
      <div className="flex items-center mb-4">
        <Award size={20} className={`mr-2 ${getScoreColor(result.score)}`} />
        <span className={`text-lg font-semibold ${getScoreColor(result.score)}`}>
          {result.score}%
        </span>
      </div>
      <div className="flex justify-end">
        <Link
          to={`/results/${result.id}`}
          className="btn btn-outline text-sm"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ResultCard;