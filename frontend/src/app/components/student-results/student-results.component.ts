import { Component, OnInit } from '@angular/core';
import { QuizResult } from '../../models/quiz-result';
import { QuizService } from '../../services/quiz-service.service';
import { AuthService } from '../../services/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-results',
  standalone: false,
  templateUrl: './student-results.component.html',
  styleUrls: ['./student-results.component.css']
})
export class StudentResultsComponent implements OnInit {
  results: QuizResult[] = [];
  loading = true;
  error: string | null = null;
  searchTerm = '';
  sortBy = 'date';
  sortOrder = 'desc';

  constructor(
    private quizService: QuizService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadResults();
  }

  loadResults(): void {
    this.loading = true;
    const studentId = this.authService.getUserId();
    if (!studentId) {
      this.error = 'User ID not found. Please log in again.';
      this.loading = false;
      return;
    }

    this.quizService.getStudentResults(Number(studentId)).subscribe({
      next: (data: QuizResult[]) => {
        this.results = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching results:', error);
        this.error = 'Failed to load quiz results. Please try again.';
        this.loading = false;
      }
    });
  }

  viewResultDetails(resultId: number | undefined): void {
    console.log('Viewing result details for ID:', resultId);
    if (resultId === undefined) {
      this.error = 'Cannot view details with undefined result ID';
      return;
    }
    this.router.navigate(['/attempt-details', resultId]);
  }

  getScoreClass(score: number): string {
    if (score >= 80) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 60) return 'average';
    return 'needs-improvement';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  get filteredResults(): QuizResult[] {
    let filtered = this.results;
    // Apply search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(result =>
        result.quiz?.title.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      let comparison = 0;
      switch (this.sortBy) {
        case 'quiz':
          comparison = (a.quiz?.title || '').localeCompare(b.quiz?.title || '');
          break;
        case 'score':
          comparison = a.score - b.score;
          break;
        case 'date':
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
}