import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Trash2, Save, AlertTriangle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useTests } from '../contexts/TestContext';
import { Question, QuestionType} from '../types';

const CreateTestPage: React.FC = () => {
  const navigate = useNavigate();
  const { addTest } = useTests();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [timeLimit, setTimeLimit] = useState<number | ''>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  
  const [formErrors, setFormErrors] = useState<{
    title?: string;
    description?: string;
    category?: string;
    questions?: string;
  }>({});
  
  const addQuestion = () => {
    const newQuestion: Question = {
      id: uuidv4(),
      text: '',
      type: 'single',
      options: [
        { id: uuidv4(), text: '' },
        { id: uuidv4(), text: '' }
      ],
      correctAnswers: [],
    };
    setQuestions([...questions, newQuestion]);
  };
  
  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };
  
  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => (q.id === id ? { ...q, ...updates } : q)));
  };
  
  const addOption = (questionId: string) => {
    setQuestions(
      questions.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            options: [...(q.options || []), { id: uuidv4(), text: '' }],
          };
        }
        return q;
      })
    );
  };
  
  const removeOption = (questionId: string, optionId: string) => {
    setQuestions(
      questions.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options?.filter(o => o.id !== optionId),
            correctAnswers: q.correctAnswers?.filter(id => id !== optionId),
          };
        }
        return q;
      })
    );
  };
  
  const updateOption = (questionId: string, optionId: string, text: string) => {
    setQuestions(
      questions.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options?.map(o => (o.id === optionId ? { ...o, text } : o)),
          };
        }
        return q;
      })
    );
  };
  
  const toggleCorrectAnswer = (questionId: string, optionId: string) => {
    setQuestions(
      questions.map(q => {
        if (q.id === questionId) {
          const correctAnswers = q.correctAnswers || [];
          
          if (q.type === 'single') {
            return { ...q, correctAnswers: [optionId] };
          } else if (q.type === 'multiple') {
            if (correctAnswers.includes(optionId)) {
              return {
                ...q,
                correctAnswers: correctAnswers.filter(id => id !== optionId),
              };
            } else {
              return { ...q, correctAnswers: [...correctAnswers, optionId] };
            }
          }
        }
        return q;
      })
    );
  };
  
  const changeQuestionType = (questionId: string, type: QuestionType) => {
    setQuestions(
      questions.map(q => {
        if (q.id === questionId) {
          const updates: Partial<Question> = { type };
          
          // Reset correct answers when changing type
          if (type === 'single' && q.correctAnswers && q.correctAnswers.length > 0) {
            updates.correctAnswers = [q.correctAnswers[0]];
          } else if (type === 'text') {
            updates.options = undefined;
            updates.correctAnswers = [];
          } else if (type === 'multiple' && q.type === 'single') {
            // Keep existing selection when going from single to multiple
          }
          
          return { ...q, ...updates };
        }
        return q;
      })
    );
  };
  
  const validateForm = () => {
    const errors: {
      title?: string;
      description?: string;
      category?: string;
      questions?: string;
    } = {};
    
    if (!title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!category.trim()) {
      errors.category = 'Category is required';
    }
    
    if (questions.length === 0) {
      errors.questions = 'At least one question is required';
    } else {
      // Validate each question
      let hasInvalidQuestion = false;
      
      for (const question of questions) {
        if (!question.text.trim()) {
          hasInvalidQuestion = true;
          break;
        }
        
        if (question.type !== 'text' && (!question.options || question.options.length < 2)) {
          hasInvalidQuestion = true;
          break;
        }
        
        if (question.type !== 'text') {
          for (const option of question.options || []) {
            if (!option.text.trim()) {
              hasInvalidQuestion = true;
              break;
            }
          }
        }
        
        if (question.type === 'single' && (!question.correctAnswers || question.correctAnswers.length !== 1)) {
          hasInvalidQuestion = true;
          break;
        }
        
        if (question.type === 'multiple' && (!question.correctAnswers || question.correctAnswers.length === 0)) {
          hasInvalidQuestion = true;
          break;
        }
      }
      
      if (hasInvalidQuestion) {
        errors.questions = 'Please complete all questions and options';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const testId = addTest({
      title,
      description,
      category,
      difficulty,
      timeLimit: timeLimit ? Number(timeLimit) : undefined,
      questions,
      createdAt: new Date().toISOString(),
    });
    
    navigate(`/tests/${testId}`);
  };
  
  return (
    <div className="page-container animate-fade-in">
      <h1 className="page-title">Create New Test</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Test details */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Test Details</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="title"
                className="input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {formErrors.title && (
                <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-600">*</span>
              </label>
              <textarea
                id="description"
                rows={3}
                className="input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
              {formErrors.description && (
                <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="category"
                  className="input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., Programming, Math, Science"
                />
                {formErrors.category && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty
                </label>
                <select
                  id="difficulty"
                  className="input"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700 mb-1">
                  Time Limit (minutes)
                </label>
                <input
                  type="number"
                  id="timeLimit"
                  className="input"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(e.target.value === '' ? '' : Number(e.target.value))}
                  min="1"
                  placeholder="Leave empty for no limit"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Questions */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Questions</h2>
            <button
              type="button"
              onClick={addQuestion}
              className="btn btn-primary flex items-center"
            >
              <PlusCircle size={18} className="mr-2" />
              Add Question
            </button>
          </div>
          
          {formErrors.questions && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{formErrors.questions}</p>
                </div>
              </div>
            </div>
          )}
          
          {questions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-500 mb-4">No questions added yet.</p>
              <button
                type="button"
                onClick={addQuestion}
                className="btn btn-outline"
              >
                Add Your First Question
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((question, index) => (
                <div key={question.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium">Question {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeQuestion(question.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor={`q-${question.id}-text`} className="block text-sm font-medium text-gray-700 mb-1">
                        Question Text <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        id={`q-${question.id}-text`}
                        className="input"
                        value={question.text}
                        onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
                        placeholder="Enter your question"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor={`q-${question.id}-type`} className="block text-sm font-medium text-gray-700 mb-1">
                        Question Type
                      </label>
                      <select
                        id={`q-${question.id}-type`}
                        className="input"
                        value={question.type}
                        onChange={(e) => changeQuestionType(question.id, e.target.value as QuestionType)}
                      >
                        <option value="single">Single Choice</option>
                        <option value="multiple">Multiple Choice</option>
                        <option value="text">Text Answer</option>
                      </select>
                    </div>
                    
                    {question.type !== 'text' && (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Options <span className="text-red-600">*</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => addOption(question.id)}
                            className="text-sm text-red-600 hover:text-red-800 flex items-center"
                          >
                            <PlusCircle size={16} className="mr-1" />
                            Add Option
                          </button>
                        </div>
                        
                        <div className="space-y-2">
                          {question.options?.map((option) => (
                            <div key={option.id} className="flex items-center space-x-2">
                              <input
                                type={question.type === 'single' ? 'radio' : 'checkbox'}
                                id={`option-${option.id}`}
                                name={`q-${question.id}-correct`}
                                checked={(question.correctAnswers || []).includes(option.id)}
                                onChange={() => toggleCorrectAnswer(question.id, option.id)}
                                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                              />
                              <input
                                type="text"
                                className="input"
                                value={option.text}
                                onChange={(e) => updateOption(question.id, option.id, e.target.value)}
                                placeholder="Option text"
                              />
                              <button
                                type="button"
                                onClick={() => removeOption(question.id, option.id)}
                                className="text-red-600 hover:text-red-800"
                                disabled={question.options?.length === 2}
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          ))}
                        </div>
                        
                        <p className="mt-2 text-sm text-gray-500">
                          {question.type === 'single' 
                            ? 'Select the correct answer.' 
                            : 'Select all correct answers.'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Submit button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="btn btn-primary flex items-center"
          >
            <Save size={18} className="mr-2" />
            Save Test
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTestPage;