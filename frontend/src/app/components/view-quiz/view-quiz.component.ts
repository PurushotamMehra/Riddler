// view-quiz.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Quiz } from '../../models/quiz';
import { Question } from '../../models/question';
import { QuizService } from '../../services/quiz-service.service';

@Component({
  selector: 'app-view-quiz',
  standalone: false,
  templateUrl: './view-quiz.component.html',
  styleUrls: ['./view-quiz.component.css']
})
export class ViewQuizComponent implements OnInit {
  quiz!: Quiz;
  loading: boolean = true;
  error: string | null = null;
  
  constructor(
    private quizService: QuizService,
    private route: ActivatedRoute,
    private router: Router
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
  
  loadQuiz(quizId: number) {
    this.loading = true;
    // Using the teacher endpoint to get questions with answers
    this.quizService.getQuizWithQuestions(quizId).subscribe({
      next: (data: Quiz) => {
        this.quiz = data;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading quiz', error);
        this.error = 'Failed to load quiz. Please try again.';
        this.loading = false;
      }
    });
  }
  
  // Helper method to get option text based on option number
  getOptionText(question: Question, optionNumber: number): string {
    switch (optionNumber) {
      case 1: return question.option1;
      case 2: return question.option2;
      case 3: return question.option3;
      case 4: return question.option4;
      default: return '';
    }
  }
  
  // Format duration in a readable format
  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} minutes`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours} hour${hours !== 1 ? 's' : ''}${mins > 0 ? ` ${mins} minute${mins !== 1 ? 's' : ''}` : ''}`;
    }
  }
  
  navigateBack(): void {
    // Navigate back based on user role
    // This can be enhanced to check user role and navigate accordingly
    this.router.navigate(['/teacher-quizzes']);
  }
}