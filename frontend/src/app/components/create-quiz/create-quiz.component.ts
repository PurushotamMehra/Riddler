import { Component, OnInit } from '@angular/core';
import { Quiz } from '../../models/quiz';
import { Question } from '../../models/question';
import { User } from '../../models/user';
import { Role } from '../../models/role';
import { QuizService } from '../../services/quiz-service.service';
import { AuthService } from '../../services/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-quiz',
  standalone: false,
  templateUrl: './create-quiz.component.html',
  styleUrls: ['./create-quiz.component.css']
})
export class CreateQuizComponent implements OnInit {
  quiz: Quiz;
  currentQuestionIndex: number | null = null;
  isFormValid: boolean = false;
  loggedInUser: User | null = null;

  constructor(
    private quizService: QuizService,
    private authService: AuthService,
    private router: Router
  ) {
    this.quiz = {
      title: '',
      duration: 0,
      teacher: {
        id: 0, // Placeholder, will be set in ngOnInit
        username: '',
        password: '',
        email: '',
        role: Role.TEACHER
      },
      questions: []
    };
  }

  ngOnInit() {
    // Get the logged-in user's details
    const userId = this.authService.getUserId();
    const username = this.authService.getCurrentUser()?.username;

    if (userId && username) {
      this.quiz.teacher = {
        id: parseInt(userId),
        username: username,
        password: '',
        email: '', // You might want to fetch email separately if needed
        role: Role.TEACHER
      };
    } else {
      // Handle case where user is not logged in
      console.error('User not logged in');
      this.router.navigate(['/login']); // Redirect to login if not authenticated
    }

    this.validateForm();
  }

  validateForm() {
    // Check if quiz title and duration are valid
    this.isFormValid = 
      !!this.quiz.title && 
      this.quiz.duration > 0 &&
      (this.currentQuestionIndex === null || this.isCurrentQuestionValid());
  }

  isCurrentQuestionValid(): boolean {
    if (this.currentQuestionIndex === null) return false;
    
    const currentQuestion = this.quiz.questions?.[this.currentQuestionIndex];
    return !!(
      currentQuestion?.questionText && 
      currentQuestion.option1 && 
      currentQuestion.option2 && 
      currentQuestion.option3 && 
      currentQuestion.option4 && 
      currentQuestion.correctOption
    );
  }

  addQuestion() {
    if (!this.quiz.questions) {
      this.quiz.questions = [];
    }
    if (this.quiz.questions.length < 30) {
      const newQuestion: Question = {
        questionText: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        correctOption: 1,
        quizId: this.quiz.id
      };
      this.quiz.questions.push(newQuestion);
      this.currentQuestionIndex = this.quiz.questions.length - 1;
      this.validateForm();
    }
  }

  removeQuestion(index: number) {
    this.quiz.questions?.splice(index, 1);
    this.currentQuestionIndex = null;
    this.validateForm();
  }

  editQuestion(index: number) {
    this.currentQuestionIndex = index;
  }

  onSubmit() {
    if (this.isFormValid && this.quiz.questions && this.quiz.questions.length > 0) {
      console.log('Quiz Created:', this.quiz);
      this.quizService.createQuiz(this.quiz).subscribe({
        next: (response) => {
          console.log('Quiz created successfully:', response);
          // Navigate to quiz list or show success message
          this.router.navigate(['/teacher/quizzes']);
        },
        error: (error) => {
          console.error('Error creating quiz:', error);
          // Add error handling (show error message)
        }
      });
    }
  }
}