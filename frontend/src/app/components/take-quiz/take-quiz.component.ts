import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Quiz } from '../../models/quiz';
import { QuizResult } from '../../models/quiz-result';
import { QuizService } from '../../services/quiz-service.service';
import { timer, Subscription } from 'rxjs';

@Component({
  selector: 'app-take-quiz',
  standalone:false,
  templateUrl: './take-quiz.component.html',
  styleUrls: ['./take-quiz.component.css']
})
export class TakeQuizComponent implements OnInit {
  quiz!: Quiz;
  answers: number[] = [];
  studentId: number = 1; // Assume student ID is retrieved from session
  loading: boolean = true;
  error: string | null = null;
  timeRemaining: number = 0;
  timerSubscription?: Subscription;
  
  constructor(
    private quizService: QuizService,
    private route: ActivatedRoute,
    public router: Router
  ) {}
  
  ngOnInit(): void {
    const quizId = Number(this.route.snapshot.paramMap.get('quizId'));
    if (isNaN(quizId)) {
      this.error = 'Invalid quiz ID';
      this.loading = false;
      return;
    }
    this.loadQuiz(quizId);
  }
  
  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
  
  loadQuiz(quizId: number) {
    this.loading = true;
    this.quizService.getQuizById(quizId).subscribe({
      next: (data: Quiz) => {
        this.quiz = data;
        this.answers = new Array(this.quiz.questions!.length).fill(0); // Initialize with zeros
        this.loading = false;
        
        // Start timer if quiz has duration
        if (this.quiz.duration) {
          this.timeRemaining = this.quiz.duration * 60; // Convert minutes to seconds
          this.startTimer();
        }
      },
      error: (error: any) => {
        console.error('Error loading quiz', error);
        this.error = 'Failed to load quiz. Please try again.';
        this.loading = false;
      }
    });
  }
  
  startTimer() {
    this.timerSubscription = timer(0, 1000).subscribe(() => {
      if (this.timeRemaining > 0) {
        this.timeRemaining--;
      } else {
        // Time's up, auto-submit
        this.submitQuiz(true);
      }
    });
  }
  
  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
  
  selectAnswer(questionIndex: number, option: number) {
    this.answers[questionIndex] = option;
  }
  
  isQuizComplete(): boolean {
    return !this.answers.includes(0);
  }

  // Add these methods to handle the template calculations
  getAnsweredCount(): number {
    return this.answers.filter(a => a !== 0).length;
  }

  getTotalQuestions(): number {
    return this.quiz?.questions?.length || 0;
  }

  getProgressPercentage(): number {
    if (!this.quiz?.questions?.length) return 0;
    return (this.getAnsweredCount() / this.getTotalQuestions()) * 100;
  }
  
  submitQuiz(timeUp: boolean = false) {
    if (!timeUp && !this.isQuizComplete()) {
      if (!confirm('You have unanswered questions. Do you still want to submit?')) {
        return;
      }
    }
    
    // Stop the timer
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    
    // Submit the quiz
    this.loading = true;
    this.quizService.submitQuiz(this.quiz.id!, this.studentId, this.answers).subscribe({
      next: (result: QuizResult) => {
        this.loading = false;
        this.router.navigate(['/result', result.id], { 
          state: { quizResult: result }
        });
      },
      error: (error: any) => {
        console.error('Error submitting quiz', error);
        this.error = 'Failed to submit quiz. Please try again.';
        this.loading = false;
      }
    });
  }

  // Add this method to your TakeQuizComponent class
  navigateToDashboard(): void {
    this.router.navigate(['/student-dashboard']);
  }
}

