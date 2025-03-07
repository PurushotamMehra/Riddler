import { Component, OnInit } from '@angular/core';
import { Quiz } from '../../models/quiz';
import { QuizService } from '../../services/quiz-service.service';
import { AuthService } from '../../services/auth-service.service';
import { Router, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';

@Component({
  selector: 'app-teacher-view-quiz',
  standalone: false,
  templateUrl: './teacher-view-quiz.component.html',
  styleUrl: './teacher-view-quiz.component.css'
})
export class TeacherViewQuizComponent implements OnInit {
  quizzes: Quiz[] = [];
  loading: boolean = true;
  error: string | null = null;
  searchTerm: string = '';
  sortBy: string = 'title';
  sortOrder: string = 'asc';

  constructor(
    private quizService: QuizService,
    private authService: AuthService,
    private router: Router
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        console.log('Navigation started to:', event.url);
      }
      if (event instanceof NavigationEnd) {
        console.log('Navigation completed to:', event.url);
      }
      if (event instanceof NavigationError) {
        console.log('Navigation error:', event.error);
      }
    });
  }

  ngOnInit(): void {
    this.loadQuizzes();
  }

  loadQuizzes(): void {
    this.loading = true;
    const userRole = this.authService.getUserRole();
    const userId = this.authService.getUserId();

    if (userRole === 'ADMIN') {
      // For ADMIN, load all quizzes
      this.quizService.getAllQuizzes().subscribe({
        next: (data: Quiz[]) => {
          this.quizzes = data;
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error loading quizzes', error);
          this.error = 'Failed to load quizzes. Please try again.';
          this.loading = false;
        }
      });
    } else if (userRole === 'TEACHER' && userId) {
      // For TEACHER, load only their own quizzes
      this.quizService.getTeacherQuizzes(parseInt(userId)).subscribe({
        next: (data: Quiz[]) => {
          this.quizzes = data;
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error loading teacher quizzes', error);
          this.error = 'Failed to load your quizzes. Please try again.';
          this.loading = false;
        }
      });
    } else {
      // For other roles or if no user ID, handle accordingly
      this.error = 'Not authorized to view quizzes';
      this.loading = false;
    }
  }

  viewQuizResults(quizId: number): void {
    console.log('Attempting to navigate to quiz results for quiz ID:', quizId);
    if (quizId && !isNaN(quizId)) {
      this.router.navigate(['/quiz-results', quizId]);
    } else {
      console.error('Invalid quiz ID for navigation:', quizId);
      this.error = 'Invalid quiz ID. Cannot view results.';
    }
  }

  viewQuiz(quizId: number): void {
    this.router.navigate(['/view-quiz', quizId]);
  }

  get filteredQuizzes(): Quiz[] {
    let filtered = this.quizzes;
    // Apply search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(quiz =>
        quiz.title.toLowerCase().includes(term) ||
        quiz.teacher?.username?.toLowerCase().includes(term)
      );
    }
    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      let comparison = 0;
      switch (this.sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'teacher':
          comparison = (a.teacher?.username || '').localeCompare(b.teacher?.username || '');
          break;
        case 'duration':
          comparison = a.duration - b.duration;
          break;
        case 'questions':
          comparison = (a.questions?.length || 0) - (b.questions?.length || 0);
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