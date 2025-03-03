// models/quiz-result.ts
import { Quiz } from './quiz';
import { User } from './user';

export interface QuizResult {
  id?: number;
  quiz?: Quiz;
  student?: User;
  score: number;
  submissionTime: string; // ISO date string
  selectedAnswers?: string; // JSON string
  answersAsList?: number[]; // Transient field
}