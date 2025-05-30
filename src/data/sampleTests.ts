import { Test } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const sampleTests: Test[] = [
  {
    id: uuidv4(),
    title: 'Web Development Basics',
    description: 'Test your knowledge of fundamental web development concepts including HTML, CSS, and JavaScript.',
    timeLimit: 15,
    category: 'Programming',
    difficulty: 'easy',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    questions: [
      {
        id: uuidv4(),
        text: 'What does HTML stand for?',
        type: 'single',
        options: [
          { id: uuidv4(), text: 'Hyper Text Markup Language' },
          { id: uuidv4(), text: 'High Tech Modern Language' },
          { id: uuidv4(), text: 'Hyper Transfer Markup Language' },
          { id: uuidv4(), text: 'Home Tool Markup Language' },
        ],
        correctAnswers: ['0'],
      },
      {
        id: uuidv4(),
        text: 'Which of the following are valid CSS selectors?',
        type: 'multiple',
        options: [
          { id: uuidv4(), text: '.class' },
          { id: uuidv4(), text: '#id' },
          { id: uuidv4(), text: '*element' },
          { id: uuidv4(), text: 'element > child' },
        ],
        correctAnswers: ['0', '1', '3'],
      },
      {
        id: uuidv4(),
        text: 'Explain the difference between let, const, and var in JavaScript.',
        type: 'text',
        correctAnswers: [],
      },
    ],
  },
  {
    id: uuidv4(),
    title: 'React Fundamentals',
    description: 'Test your understanding of React core concepts and hooks.',
    timeLimit: 20,
    category: 'Programming',
    difficulty: 'medium',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    questions: [
      {
        id: uuidv4(),
        text: 'What is JSX?',
        type: 'single',
        options: [
          { id: uuidv4(), text: 'JavaScript XML' },
          { id: uuidv4(), text: 'Java Syntax Extension' },
          { id: uuidv4(), text: 'JavaScript Extension' },
          { id: uuidv4(), text: 'JSON XML Syntax' },
        ],
        correctAnswers: ['0'],
      },
      {
        id: uuidv4(),
        text: 'Which of the following are React hooks?',
        type: 'multiple',
        options: [
          { id: uuidv4(), text: 'useState' },
          { id: uuidv4(), text: 'useContext' },
          { id: uuidv4(), text: 'useHistory' },
          { id: uuidv4(), text: 'useComponent' },
        ],
        correctAnswers: ['0', '1', '2'],
      },
      {
        id: uuidv4(),
        text: 'What is the virtual DOM and why is it important?',
        type: 'text',
        correctAnswers: [],
      },
    ],
  },
  {
    id: uuidv4(),
    title: 'Basic Mathematics',
    description: 'Test your knowledge of basic mathematical concepts and problem-solving abilities.',
    timeLimit: 30,
    category: 'Mathematics',
    difficulty: 'medium',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    questions: [
      {
        id: uuidv4(),
        text: 'What is the value of x in the equation 2x + 5 = 15?',
        type: 'single',
        options: [
          { id: uuidv4(), text: '5' },
          { id: uuidv4(), text: '10' },
          { id: uuidv4(), text: '7.5' },
          { id: uuidv4(), text: '4' },
        ],
        correctAnswers: ['0'],
      },
      {
        id: uuidv4(),
        text: 'Which of the following are prime numbers?',
        type: 'multiple',
        options: [
          { id: uuidv4(), text: '2' },
          { id: uuidv4(), text: '4' },
          { id: uuidv4(), text: '7' },
          { id: uuidv4(), text: '9' },
        ],
        correctAnswers: ['0', '2'],
      },
      {
        id: uuidv4(),
        text: 'Solve for the area of a circle with radius 7cm. Show your work.',
        type: 'text',
        correctAnswers: [],
      },
    ],
  },
];