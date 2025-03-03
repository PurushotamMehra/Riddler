import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Quiz } from '../../models/quiz';
import { QuizService } from '../../services/quiz-service.service';

@Component({
  selector: 'app-display-quizzes',
  standalone: false,
  templateUrl: './display-quizzes.component.html',
  styleUrls: ['./display-quizzes.component.css']
})
export class DisplayQuizzesComponent implements OnInit {
  quizzes: Quiz[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private quizService: QuizService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadQuizzes();
  }

  loadQuizzes(): void {
    this.loading = true;
    this.quizService.getAllQuizzes().subscribe(
      (data: Quiz[]) => {
        this.quizzes = data;
        this.loading = false;
      },
      (error: any) => {
        console.error('Error fetching quizzes', error);
        this.errorMessage = 'Failed to load quizzes. Please try again.';
        this.loading = false;
      }
    );
  }

  attemptQuiz(quizId: number | undefined): void {
    if (quizId === undefined) {
      this.errorMessage = 'Cannot attempt quiz with undefined ID';
      return;
    }
    this.router.navigate(['/take-quiz', quizId]);
  }
}