export type QuestionType = 'single' | 'multiple' | 'text';

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: Option[];
  correctAnswers?: string[]; // IDs of correct options
}

export interface Test {
  id: string;
  title: string;
  description: string;
  timeLimit?: number; // in minutes, optional
  questions: Question[];
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: string; // ISO date string
}

export interface Answer {
  questionId: string;
  selectedOptions?: string[]; // IDs of selected options
  textAnswer?: string; // For text questions
}

export interface TestResult {
  id: string;
  testId: string;
  answers: Answer[];
  score: number; // Percentage score
  timeTaken: number; // in seconds
  date: string; // ISO date string
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
}