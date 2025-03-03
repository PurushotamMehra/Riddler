import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Quiz } from '../../models/quiz';
import { QuizResult } from '../../models/quiz-result';
import { Role } from '../../models/role';
import { User } from '../../models/user';
import { QuizService } from '../../services/quiz-service.service';
import { UserService } from '../../services/user-service.service';

@Component({
  selector: 'app-user-profile',
  standalone: false,
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  user: User | null = null;
  quizzes: Quiz[] = [];
  quizResults: QuizResult[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private quizService: QuizService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    const userId = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(userId)) {
      this.error = 'Invalid user ID';
      this.loading = false;
      return;
    }

    this.userService.getUserById(userId).subscribe({
      next: (userData: User) => {
        this.user = userData;
        
        // Load additional data based on user role
        if (this.user.role === Role.STUDENT) {
          this.loadStudentData(userId);
        } else if (this.user.role === Role.TEACHER) {
          this.loadTeacherData(userId);
        } else {
          this.loading = false;
        }
      },
      error: (error: any) => {
        console.error('Error loading user profile', error);
        this.error = 'Failed to load user profile. Please try again.';
        this.loading = false;
      }
    });
  }

  loadStudentData(studentId: number): void {
    this.quizService.getStudentResults(studentId).subscribe({
      next: (results: QuizResult[]) => {
        this.quizResults = results;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading student quiz results', error);
        this.error = 'Failed to load quiz results. Please try again.';
        this.loading = false;
      }
    });
  }

  loadTeacherData(teacherId: number): void {
    this.quizService.getTeacherQuizzes(teacherId).subscribe({
      next: (quizzes: Quiz[]) => {
        this.quizzes = quizzes;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading teacher quizzes', error);
        this.error = 'Failed to load quizzes. Please try again.';
        this.loading = false;
      }
    });
  }

  takeQuiz(quizId: number): void {
    this.router.navigate(['/take-quiz', quizId]);
  }

  goBack(): void {
    this.router.navigate(['/user-list']);
  }

  getScoreClass(score: number): string {
    if (score >= 80) return 'high-score';
    if (score >= 60) return 'medium-score';
    return 'low-score';
  }

  // Add this method to calculate average score
  calculateAverageScore(): string {
    if (this.quizResults.length === 0) return '0.0';
    
    const sum = this.quizResults.reduce((total, result) => {
      return total + result.score;
    }, 0);
    
    return (sum / this.quizResults.length).toFixed(1);
  }
}
