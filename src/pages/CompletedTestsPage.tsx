import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, AlertTriangle } from 'lucide-react';
import { useTests } from '../contexts/TestContext';
import ResultCard from '../components/ResultCard';

const CompletedTestsPage: React.FC = () => {
  const { getCompletedTests, getTest } = useTests();
  const results = getCompletedTests();

  return (
    <div className="page-container animate-fade-in">
      <h1 className="page-title">My Completed Tests</h1>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map(result => {
            const test = getTest(result.testId);
            if (!test) return null;
            
            return (
              <ResultCard key={result.id} result={result} test={test} />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <ClipboardList className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No completed tests yet</h3>
          <p className="text-gray-500 mb-6">
            Take a test to see your results here.
          </p>
          <Link to="/tests" className="btn btn-primary">
            Browse Tests
          </Link>
        </div>
      )}
    </div>
  );
};

export default CompletedTestsPage;