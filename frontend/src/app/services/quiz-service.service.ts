import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quiz } from '../models/quiz';
import { QuizResult } from '../models/quiz-result';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Teacher methods
  createQuiz(quiz: Quiz): Observable<Quiz> {
    return this.http.post<Quiz>(`${this.apiUrl}/teacher/quiz`, quiz);
  }

  getTeacherQuizzes(teacherId: number): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${this.apiUrl}/teacher/quiz/${teacherId}`);
  }

  getQuizResults(quizId: number): Observable<QuizResult[]> {
    return this.http.get<QuizResult[]>(`${this.apiUrl}/teacher/results/${quizId}`);
  }
  

  getQuizWithQuestions(quizId: number): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.apiUrl}/teacher/quizzesquest/${quizId}`);
  }

  // Student methods
  getQuizById(quizId: number): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.apiUrl}/student/quiz/${quizId}`);
  }

  submitQuiz(quizId: number, studentId: number, answers: number[]): Observable<QuizResult> {
    return this.http.post<QuizResult>(
      `${this.apiUrl}/student/quiz/${quizId}/submit/${studentId}`, 
      answers
    );
  }

  getStudentResults(studentId: number): Observable<QuizResult[]> {
    return this.http.get<QuizResult[]>(`${this.apiUrl}/student/results/${studentId}`);
  }

  getStudentQuizResult(studentId: number, quizId: number): Observable<QuizResult> {
    return this.http.get<QuizResult>(
      `${this.apiUrl}/student/results/${studentId}/quiz/${quizId}`
    );
  }

  // New method to fetch all quizzes for display
  getAllQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${this.apiUrl}/teacher/quizzes`);
  }

  // Get a specific quiz result by ID
  getQuizResultById(resultId: number): Observable<QuizResult> {
    return this.http.get<QuizResult>(`${this.apiUrl}/student/result/${resultId}`);
  }

  // Get all results for a specific quiz
  getAllResultsForQuiz(quizId: number): Observable<QuizResult[]> {
    return this.http.get<QuizResult[]>(`${this.apiUrl}/teacher/results/${quizId}`);
  }

  // Add this to your QuizService
  getQuizWithQuestionsForStudent(quizId: number): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.apiUrl}/student/quiz/${quizId}`);
  }
}

