import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Test, Question, TestResult, QuestionType } from '../types';
import { sampleTests } from '../data/sampleTests';

interface TestContextType {
  tests: Test[];
  results: TestResult[];
  addTest: (test: Omit<Test, 'id'>) => string;
  getTest: (id: string) => Test | undefined;
  saveTestResult: (result: Omit<TestResult, 'id'>) => string;
  getTestResult: (id: string) => TestResult | undefined;
  getCompletedTests: () => TestResult[];
}

const TestContext = createContext<TestContextType | undefined>(undefined);

export const useTests = () => {
  const context = useContext(TestContext);
  if (!context) {
    throw new Error('useTests must be used within a TestProvider');
  }
  return context;
};

export const TestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tests, setTests] = useState<Test[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);

  // Initialize with sample data
  useEffect(() => {
    const storedTests = localStorage.getItem('tests');
    const storedResults = localStorage.getItem('testResults');
    
    if (storedTests) {
      setTests(JSON.parse(storedTests));
    } else {
      setTests(sampleTests);
      localStorage.setItem('tests', JSON.stringify(sampleTests));
    }
    
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    }
  }, []);

  // Save to localStorage whenever tests or results change
  useEffect(() => {
    localStorage.setItem('tests', JSON.stringify(tests));
  }, [tests]);

  useEffect(() => {
    localStorage.setItem('testResults', JSON.stringify(results));
  }, [results]);

  const addTest = (test: Omit<Test, 'id'>): string => {
    const id = uuidv4();
    const newTest = { ...test, id };
    setTests(prev => [...prev, newTest]);
    return id;
  };

  const getTest = (id: string): Test | undefined => {
    return tests.find(test => test.id === id);
  };

  const saveTestResult = (result: Omit<TestResult, 'id'>): string => {
    const id = uuidv4();
    const newResult = { ...result, id, date: new Date().toISOString() };
    setResults(prev => [...prev, newResult]);
    return id;
  };

  const getTestResult = (id: string): TestResult | undefined => {
    return results.find(result => result.id === id);
  };

  const getCompletedTests = (): TestResult[] => {
    return results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  return (
    <TestContext.Provider value={{
      tests,
      results,
      addTest,
      getTest,
      saveTestResult,
      getTestResult,
      getCompletedTests,
    }}>
      {children}
    </TestContext.Provider>
  );
};