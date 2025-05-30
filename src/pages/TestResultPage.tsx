import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Clock, Award, Check, X, AlertTriangle, Home, RotateCcw } from 'lucide-react';
import { useTests } from '../contexts/TestContext';

const TestResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTestResult, getTest } = useTests();
  
  const result = getTestResult(id || '');
  const test = result ? getTest(result.testId) : undefined;
  
  if (!result || !test) {
    return (
      <div className="page-container">
        <div className="text-center py-12">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Result Not Found</h2>
          <p className="text-gray-600 mb-6">The test result you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/completed-tests')}
            className="btn btn-primary"
          >
            My Test Results
          </button>
        </div>
      </div>
    );
  }
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-50';
    if (score >= 60) return 'bg-yellow-50';
    return 'bg-red-50';
  };
  
  const getAnswerForQuestion = (questionId: string) => {
    return result.answers.find(a => a.questionId === questionId);
  };
  
  const isAnswerCorrect = (questionId: string) => {
    const question = test.questions.find(q => q.id === questionId);
    const answer = getAnswerForQuestion(questionId);
    
    if (!question || !answer) return false;
    if (question.type === 'text') return null; // Text questions aren't auto-scored
    
    if (question.type === 'single') {
      return answer.selectedOptions?.[0] === question.correctAnswers?.[0];
    } else if (question.type === 'multiple') {
      const selectedSet = new Set(answer.selectedOptions);
      const correctSet = new Set(question.correctAnswers);
      
      // Check if the sets are equal
      return selectedSet.size === correctSet.size && 
        [...selectedSet].every(value => correctSet.has(value));
    }
    
    return false;
  };
  
  const getOptionClass = (questionId: string, optionId: string) => {
    const question = test.questions.find(q => q.id === questionId);
    const answer = getAnswerForQuestion(questionId);
    
    if (!question || !answer) return '';
    
    const isSelected = answer.selectedOptions?.includes(optionId);
    const isCorrect = question.correctAnswers?.includes(optionId);
    
    if (isSelected && isCorrect) return 'bg-green-100 border-green-500';
    if (isSelected && !isCorrect) return 'bg-red-100 border-red-500';
    if (!isSelected && isCorrect) return 'bg-green-50 border-green-500 border-dashed';
    
    return '';
  };
  
  return (
    <div className="page-container animate-fade-in">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">{test.title} - Results</h1>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-700">Completed on {formatDate(result.date)}</p>
              <div className="flex items-center mt-2">
                <Clock size={18} className="mr-2 text-gray-500" />
                <span className="text-gray-700">Time taken: {formatTime(result.timeTaken)}</span>
              </div>
            </div>
            
            <div className={`flex items-center justify-center w-24 h-24 rounded-full ${getScoreBackground(result.score)} p-1`}>
              <div className="w-full h-full rounded-full border-4 border-white flex items-center justify-center">
                <div className="text-center">
                  <span className={`text-2xl font-bold ${getScoreColor(result.score)}`}>
                    {result.score}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Link to="/tests" className="btn btn-secondary flex items-center">
              <Home size={18} className="mr-2" />
              Browse Tests
            </Link>
            <Link to={`/tests/${test.id}`} className="btn btn-primary flex items-center">
              <RotateCcw size={18} className="mr-2" />
              Retake Test
            </Link>
          </div>
        </div>
        
        {/* Questions and Answers */}
        <div className="space-y-6">
          {test.questions.map((question, index) => {
            const answer = getAnswerForQuestion(question.id);
            const isCorrect = isAnswerCorrect(question.id);
            
            return (
              <div 
                key={question.id} 
                className="bg-white rounded-lg shadow-md p-6 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">
                    Question {index + 1}: {question.text}
                  </h3>
                  {isCorrect !== null && (
                    <div className={`flex items-center ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      {isCorrect ? (
                        <Check className="h-5 w-5 mr-1" />
                      ) : (
                        <X className="h-5 w-5 mr-1" />
                      )}
                      <span className="font-medium">
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                  )}
                </div>
                
                {question.type === 'text' ? (
                  <div>
                    <p className="text-gray-700 font-medium mb-2">Your Answer:</p>
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                      <p className="whitespace-pre-wrap">{answer?.textAnswer || 'No answer provided'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {question.options?.map(option => (
                      <div
                        key={option.id}
                        className={`flex items-center p-4 border rounded-md ${getOptionClass(question.id, option.id)}`}
                      >
                        <div
                          className={`flex-shrink-0 w-5 h-5 mr-3 border rounded-full flex items-center justify-center ${
                            answer?.selectedOptions?.includes(option.id)
                              ? 'bg-red-600 border-red-600'
                              : 'border-gray-400'
                          }`}
                        >
                          {answer?.selectedOptions?.includes(option.id) && (
                            <Check className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <span>{option.text}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {!isCorrect && question.type !== 'text' && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-gray-700 font-medium mb-2">Correct Answer:</p>
                    <div className="text-green-700">
                      {question.type === 'single' ? (
                        <p>
                          {question.options?.find(o => o.id === question.correctAnswers?.[0])?.text}
                        </p>
                      ) : (
                        <ul className="list-disc list-inside">
                          {question.options
                            ?.filter(o => question.correctAnswers?.includes(o.id))
                            .map(o => (
                              <li key={o.id}>{o.text}</li>
                            ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TestResultPage;