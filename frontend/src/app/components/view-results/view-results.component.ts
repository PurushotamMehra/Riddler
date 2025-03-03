// view-results.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Quiz } from '../../models/quiz';
import { QuizResult } from '../../models/quiz-result';
import { QuizService } from '../../services/quiz-service.service';

@Component({
  selector: 'app-view-results',
  standalone: false,
  templateUrl: './view-results.component.html',
  styleUrl: './view-results.component.css'
})
export class ViewResultsComponent implements OnInit {
  quizId!: number;
  quiz?: Quiz;
  results: QuizResult[] = [];
  loading: boolean = true;
  error: string | null = null;
  searchTerm: string = '';
  sortBy: string = 'submissionTime';
  sortOrder: string = 'desc';

  constructor(
    private quizService: QuizService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Added more detailed logging for debugging
    console.log('ViewResultsComponent initialized');
    console.log('Route params:', this.route.snapshot.paramMap);
    
    const quizIdParam = this.route.snapshot.paramMap.get('quizId');
    console.log('Extracted quizId param:', quizIdParam);
    
    this.quizId = quizIdParam ? parseInt(quizIdParam, 10) : 0;
    console.log('Parsed quizId:', this.quizId);
    
    if (isNaN(this.quizId) || this.quizId === 0) {
      console.error('Invalid quiz ID detected:', quizIdParam);
      this.error = 'Invalid quiz ID';
      this.loading = false;
      return;
    }
    
    this.loadQuizAndResults();
  }

  loadQuizAndResults(): void {
    this.loading = true;
    console.log('Loading quiz and results for quiz ID:', this.quizId);
    
    // First load the quiz details
    this.quizService.getQuizById(this.quizId).subscribe({
      next: (quizData: Quiz) => {
        console.log('Quiz data loaded successfully:', quizData);
        this.quiz = quizData;
        
        // Then load all results for this quiz
        this.quizService.getAllResultsForQuiz(this.quizId).subscribe({
          next: (resultsData: QuizResult[]) => {
            console.log('Quiz results loaded successfully:', resultsData);
            this.results = resultsData;
            this.loading = false;
          },
          error: (error: any) => {
            console.error('Error loading quiz results', error);
            this.error = 'Failed to load quiz results. Please try again.';
            this.loading = false;
          }
        });
      },
      error: (error: any) => {
        console.error('Error loading quiz', error);
        this.error = 'Failed to load quiz details. Please try again.';
        this.loading = false;
      }
    });
  }

// In view-results.component.ts
viewResultDetails(resultId: number): void {
  console.log('Navigating to attempt details for result ID:', resultId);
  this.router.navigate(['/attempt-details', resultId]);
}

  // Calculate percentage score
  getPercentage(score: number, total: number): number {
    return total > 0 ? (score / total) * 100 : 0;
  }

  // Format date from ISO string
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }

  get filteredResults(): QuizResult[] {
    let filtered = this.results;
    
    // Apply search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(result => 
        result.student?.username?.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      let comparison = 0;
      
      switch (this.sortBy) {
        case 'student':
          comparison = (a.student?.username || '').localeCompare(b.student?.username || '');
          break;
        case 'score':
          comparison = a.score - b.score;
          break;
        case 'percentage':
          const aPercentage = this.getPercentage(a.score, a.quiz?.questions?.length || 1);
          const bPercentage = this.getPercentage(b.score, b.quiz?.questions?.length || 1);
          comparison = aPercentage - bPercentage;
          break;
        case 'submissionTime':
          comparison = new Date(a.submissionTime).getTime() - new Date(b.submissionTime).getTime();
          break;
      }
      
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  }

  applySorting(column: string): void {
    if (this.sortBy === column) {
      // Toggle sort order if clicking on the same column
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      // Default to ascending when changing columns
      this.sortBy = column;
      this.sortOrder = 'asc';
    }
  }

  getSortIcon(column: string): string {
    if (this.sortBy !== column) {
      return 'fa-sort'; // Neutral icon
    }
    return this.sortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
  }

  navigateBack(): void {
    this.router.navigate(['/teacher-quizzes']);
  }

  // Helper method to safely calculate average score
  getAverageScore(): string {
    if (this.results.length === 0 || !this.quiz?.questions?.length) {
      return '0';
    }
    
    const totalScore = this.results.reduce((sum, result) => sum + result.score, 0);
    return (totalScore / this.results.length).toFixed(1);
  }
}