import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Clock, ChevronLeft, ChevronRight, CheckCircle, AlertTriangle } from 'lucide-react';
import { useTests } from '../contexts/TestContext';
import { Answer } from '../types';

const TakeTestPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTest, saveTestResult } = useTests();
  
  const test = getTest(id || '');
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [testStarted, setTestStarted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (test && testStarted) {
      // Initialize answers if not already
      if (answers.length === 0) {
        const initialAnswers = test.questions.map(q => ({
          questionId: q.id,
          selectedOptions: [],
          textAnswer: '',
        }));
        setAnswers(initialAnswers);
      }
      
      // Set up timer
      if (test.timeLimit) {
        setTimeRemaining(test.timeLimit * 60);
      }
    }
  }, [test, testStarted]);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (testStarted) {
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
        
        if (timeRemaining !== null) {
          setTimeRemaining(prev => {
            if (prev === null) return null;
            if (prev <= 1) {
              clearInterval(timer);
              submitTest();
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    
    return () => {
      clearInterval(timer);
    };
  }, [testStarted, timeRemaining]);
  
  if (!test) {
    return (
      <div className="page-container">
        <div className="text-center py-12">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Test Not Found</h2>
          <p className="text-gray-600 mb-6">The test you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate('/tests')}
            className="btn btn-primary"
          >
            Browse Tests
          </button>
        </div>
      </div>
    );
  }
  
  const currentQuestion = test.questions[currentQuestionIndex];
  
  const startTest = () => {
    setTestStarted(true);
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  const handleOptionSelect = (optionId: string) => {
    setAnswers(prev => {
      const updatedAnswers = [...prev];
      const answerIndex = updatedAnswers.findIndex(
        a => a.questionId === currentQuestion.id
      );
      
      if (answerIndex !== -1) {
        if (currentQuestion.type === 'single') {
          updatedAnswers[answerIndex].selectedOptions = [optionId];
        } else if (currentQuestion.type === 'multiple') {
          const selectedOptions = updatedAnswers[answerIndex].selectedOptions || [];
          
          if (selectedOptions.includes(optionId)) {
            updatedAnswers[answerIndex].selectedOptions = selectedOptions.filter(
              id => id !== optionId
            );
          } else {
            updatedAnswers[answerIndex].selectedOptions = [...selectedOptions, optionId];
          }
        }
      }
      
      return updatedAnswers;
    });
  };
  
  const handleTextChange = (text: string) => {
    setAnswers(prev => {
      const updatedAnswers = [...prev];
      const answerIndex = updatedAnswers.findIndex(
        a => a.questionId === currentQuestion.id
      );
      
      if (answerIndex !== -1) {
        updatedAnswers[answerIndex].textAnswer = text;
      }
      
      return updatedAnswers;
    });
  };
  
  const calculateScore = () => {
    let correctCount = 0;
    let totalQuestions = 0;
    
    test.questions.forEach(question => {
      if (question.type === 'text') return; // Skip text questions for auto-scoring
      
      totalQuestions++;
      const answer = answers.find(a => a.questionId === question.id);
      
      if (!answer || !answer.selectedOptions) return;
      
      if (question.type === 'single') {
        if (answer.selectedOptions[0] === question.correctAnswers?.[0]) {
          correctCount++;
        }
      } else if (question.type === 'multiple') {
        const selectedSet = new Set(answer.selectedOptions);
        const correctSet = new Set(question.correctAnswers);
        
        // Check if the sets are equal
        if (selectedSet.size === correctSet.size && 
            [...selectedSet].every(value => correctSet.has(value))) {
          correctCount++;
        }
      }
    });
    
    return Math.round((correctCount / totalQuestions) * 100);
  };
  
  const submitTest = () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    const score = calculateScore();
    const resultId = saveTestResult({
      testId: test.id,
      answers,
      score,
      timeTaken: elapsedTime,
    });
    
    navigate(`/results/${resultId}`);
  };
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  const getCurrentAnswer = () => {
    return answers.find(a => a.questionId === currentQuestion?.id);
  };
  
  // Check if options are selected for the current question
  const isOptionSelected = (optionId: string) => {
    const currentAnswer = getCurrentAnswer();
    return currentAnswer?.selectedOptions?.includes(optionId) || false;
  };
  
  if (!testStarted) {
    return (
      <div className="page-container animate-fade-in">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold mb-4">{test.title}</h1>
          <div className="mb-6">
            <p className="text-gray-700 mb-4">{test.description}</p>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <Clock size={18} className="mr-2" />
              {test.timeLimit ? `Time limit: ${test.timeLimit} minutes` : 'No time limit'}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="font-medium">Questions:</span>
              <span className="ml-2">{test.questions.length}</span>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Once you start the test, the timer will begin. Make sure you're ready before proceeding.
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={startTest}
              className="w-full btn btn-primary py-3"
            >
              Start Test
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="page-container animate-fade-in">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex justify-between items-center">
          <h1 className="text-xl font-semibold">{test.title}</h1>
          {timeRemaining !== null && (
            <div className="flex items-center text-sm font-medium">
              <Clock size={16} className="mr-1" />
              <span className={timeRemaining < 60 ? 'text-red-600' : ''}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          )}
        </div>
        
        {/* Progress bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestionIndex + 1} of {test.questions.length}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round(((currentQuestionIndex + 1) / test.questions.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-red-600 h-2.5 rounded-full"
              style={{
                width: `${((currentQuestionIndex + 1) / test.questions.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>
        
        {/* Question card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 transition-all duration-300 animate-slide-up">
          <h2 className="text-xl font-semibold mb-6">{currentQuestion.text}</h2>
          
          {currentQuestion.type === 'text' ? (
            <div>
              <textarea
                className="w-full min-h-[200px] p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Type your answer here..."
                value={getCurrentAnswer()?.textAnswer || ''}
                onChange={(e) => handleTextChange(e.target.value)}
              ></textarea>
            </div>
          ) : (
            <div className="space-y-3">
              {currentQuestion.options?.map((option, index) => (
                <div
                  key={option.id}
                  className={`flex items-center p-4 border rounded-md cursor-pointer transition-colors duration-200 ${
                    isOptionSelected(option.id)
                      ? 'bg-red-50 border-red-500'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleOptionSelect(option.id)}
                >
                  <div
                    className={`flex-shrink-0 w-5 h-5 mr-3 border rounded-full flex items-center justify-center ${
                      isOptionSelected(option.id)
                        ? 'bg-red-600 border-red-600'
                        : 'border-gray-400'
                    }`}
                  >
                    {isOptionSelected(option.id) && (
                      <CheckCircle className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <span>{option.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
            className={`btn ${
              currentQuestionIndex === 0
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'btn-secondary'
            }`}
          >
            <ChevronLeft size={18} className="mr-1" />
            Previous
          </button>
          
          {currentQuestionIndex < test.questions.length - 1 ? (
            <button
              onClick={handleNextQuestion}
              className="btn btn-primary"
            >
              Next
              <ChevronRight size={18} className="ml-1" />
            </button>
          ) : (
            <button
              onClick={submitTest}
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Test'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TakeTestPage;