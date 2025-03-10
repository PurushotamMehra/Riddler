import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Quiz } from '../../models/quiz';
import { QuizResult } from '../../models/quiz-result';
import { QuizService } from '../../services/quiz-service.service';

@Component({
  selector: 'app-quiz-result',
  standalone: false,
  templateUrl: './quiz-result.component.html',
  styleUrls: ['./quiz-result.component.css']
})
export class QuizResultComponent implements OnInit {
  result?: QuizResult;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private quizService: QuizService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // First try to get the result from navigation state
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { quizResult: QuizResult };
    
    if (state && state.quizResult) {
      this.result = state.quizResult;
      this.loading = false;
    } else {
      // If not in state, try to get from route param
      const resultId = Number(this.route.snapshot.paramMap.get('resultId'));
      if (isNaN(resultId)) {
        this.error = 'Invalid result ID';
        this.loading = false;
        return;
      }
      this.loadResult(resultId);
    }
  }

  loadResult(resultId: number): void {
    this.loading = true;
    this.quizService.getQuizResultById(resultId).subscribe({
      next: (data: QuizResult) => {
        this.result = data;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading quiz result', error);
        this.error = 'Failed to load quiz result. Please try again.';
        this.loading = false;
      }
    });
  }

  navigateToDashboard(): void {
    this.router.navigate(['/quizzes']);
  }

  // Calculate percentage score
  getPercentage(score: number, total: number): number {
    return (score / total) * 100;
  }

  // Format date from ISO string
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }
}