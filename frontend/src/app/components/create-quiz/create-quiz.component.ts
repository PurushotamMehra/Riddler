import { Component, OnInit } from '@angular/core';
import { Quiz } from '../../models/quiz';
import { Role } from '../../models/role';
import { QuizService } from '../../services/quiz-service.service';

@Component({
  selector: 'app-create-quiz',
  standalone: false,
  templateUrl: './create-quiz.component.html',
  styleUrl: './create-quiz.component.css'
})
export class CreateQuizComponent implements OnInit {
  quiz: Quiz;

  constructor(private quizService: QuizService) {
    // Initialize quiz in constructor
    this.quiz = {
      title: '',
      duration: 0,
      teacher: {
        id: 1,
        username: 'Logged In Teacher',
        password: '',
        email: '',
        role: Role.TEACHER
      },
      questions: [] // Initialize as empty array
    };
  }

  ngOnInit() {
    // Any additional initialization can go here
  }

  addQuestion() {
    if (this.quiz.questions!.length < 30) {
      this.quiz.questions!.push({
        questionText: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        correctOption: 1,
        quizId: this.quiz.id
      });
    }
  }

  removeQuestion(index: number) {
    this.quiz.questions!.splice(index, 1);
  }

  onSubmit() {
    console.log('Quiz Created:', this.quiz);
    this.quizService.createQuiz(this.quiz).subscribe({
      next: (response) => {
        console.log('Quiz created successfully:', response);
        // Add success handling (redirect, message, etc.)
      },
      error: (error) => {
        console.error('Error creating quiz:', error);
        // Add error handling
      }
    });
  }
}