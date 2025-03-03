export interface Question {
  id?: number;
  questionText: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctOption: number; // 1-4
  quizId?: number; // Reference to Quiz
}
