import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizResult } from '../../models/quiz-result';
import { Quiz } from '../../models/quiz';
import { QuizService } from '../../services/quiz-service.service';

@Component({
  selector: 'app-quiz-attempt-details',
  standalone: false,
  templateUrl: './quiz-attempt-details.component.html',
  styleUrls: ['./quiz-attempt-details.component.css']
})
export class QuizAttemptDetailsComponent implements OnInit {
  resultId!: number;
  result!: QuizResult;
  quiz!: Quiz;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService
  ) {}

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('resultId');
    console.log('Extracted result ID from route:', param); // Debugging
    this.resultId = param ? Number(param) : NaN;
    if (!this.resultId || isNaN(this.resultId)) {
      this.error = 'Invalid result ID';
      this.loading = false;
      return;
    }
    this.loadResultDetails();
  }

  loadResultDetails(): void {
    this.loading = true;
    this.quizService.getQuizResultById(this.resultId).subscribe({
      next: (resultData: QuizResult) => {
        console.log('Result data loaded:', resultData);
        this.result = resultData;
        this.result.answersAsList = resultData.selectedAnswers
          ? JSON.parse(resultData.selectedAnswers)
          : [];
          
        // If we have a quiz ID, load the quiz using the student endpoint
        if (this.result.quiz?.id) {
          // Use the student endpoint instead of teacher endpoint
          this.quizService.getQuizById(this.result.quiz.id).subscribe({
            next: (quizData: Quiz) => {
              console.log('Quiz data loaded:', quizData);
              this.quiz = quizData;
              this.loading = false;
            },
            error: (error) => {
              console.error('Error loading quiz details', error);
              this.error = 'Failed to load quiz details';
              this.loading = false;
            }
          });
        } else {
          this.error = 'Quiz information missing from result';
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error loading result details', error);
        this.error = 'Failed to load attempt details';
        this.loading = false;
      }
    });
  }

  isCorrectAnswer(questionIndex: number, selectedOptionIndex: number): boolean {
    if (!this.quiz?.questions || !this.result?.answersAsList) return false;
    const question = this.quiz.questions[questionIndex];
    if (!question) return false;
    return (this.result.answersAsList[questionIndex] ?? -1) + 1 === question.correctOption;
  }

  getSelectedOptionText(questionIndex: number): string {
    if (!this.quiz?.questions || !this.result?.answersAsList) return 'No answer provided';
    const question = this.quiz.questions[questionIndex];
    if (!question) return 'No options available';
    const selectedOptionIndex = (this.result.answersAsList[questionIndex] ?? -1) - 1;
    const options = [question.option1, question.option2, question.option3, question.option4];
    return options[selectedOptionIndex] || 'Unknown option';
  }

  getCorrectOptionText(questionIndex: number): string {
    if (!this.quiz?.questions) return 'Unknown';
    const question = this.quiz.questions[questionIndex];
    if (!question) return 'No options available';
    const options = [question.option1, question.option2, question.option3, question.option4];
    return options[question.correctOption - 1] || 'No correct answer defined';
  }

  navigateBack(): void {
    this.router.navigate(['/my-results']);
  }
}
// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { QuizResult } from '../../models/quiz-result';
// import { Quiz } from '../../models/quiz';
// import { QuizService } from '../../services/quiz-service.service';

// @Component({
//   selector: 'app-quiz-attempt-details',
//   standalone:false,
//   templateUrl: './quiz-attempt-details.component.html',
//   styleUrls: ['./quiz-attempt-details.component.css']
// })
// export class QuizAttemptDetailsComponent implements OnInit {
//   resultId!: number;
//   result!: QuizResult;
//   quiz!: Quiz;
//   loading = true;
//   error: string | null = null;

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private quizService: QuizService
//   ) {}

//   ngOnInit(): void {
//     const param = this.route.snapshot.paramMap.get('resultId');
//     console.log('Extracted result ID from route:', param); // Debugging
    
//     this.resultId = param ? Number(param) : NaN;
    
//     if (!this.resultId || isNaN(this.resultId)) {
//       this.error = 'Invalid result ID';
//       this.loading = false;
//       return;
//     }
  
//     this.loadResultDetails();
//   }
  

//   // loadResultDetails(): void {
//   //   this.loading = true;

//   //   this.quizService.getQuizResultById(this.resultId).subscribe({
//   //     next: (resultData: QuizResult) => {
//   //       console.log('Result data loaded:', resultData);
//   //       this.result = resultData;
//   //       this.result.answersAsList = resultData.selectedAnswers
//   //         ? JSON.parse(resultData.selectedAnswers)
//   //         : [];

//   //       if (this.result.quiz?.id) {
//   //         this.quizService.getQuizWithQuestions(this.result.quiz.id).subscribe({
//   //           next: (quizData: Quiz) => {
//   //             console.log('Quiz with questions loaded:', quizData);
//   //             this.quiz = quizData;
//   //             this.loading = false;
//   //           },
//   //           error: (error) => {
//   //             console.error('Error loading quiz details', error);
//   //             this.error = 'Failed to load quiz details';
//   //             this.loading = false;
//   //           }
//   //         });
//   //       } else {
//   //         this.error = 'Quiz information missing from result';
//   //         this.loading = false;
//   //       }
//   //     },
//   //     error: (error) => {
//   //       console.error('Error loading result details', error);
//   //       this.error = 'Failed to load attempt details';
//   //       this.loading = false;
//   //     }
//   //   });
//   // }
//   loadResultDetails(): void {
//     this.loading = true;
//     // First get the quiz result using the student endpoint
//     this.quizService.getQuizResultById(this.resultId).subscribe({
//       next: (resultData: QuizResult) => {
//         console.log('Result data loaded:', resultData);
//         this.result = resultData;
//         this.result.answersAsList = resultData.selectedAnswers
//           ? JSON.parse(resultData.selectedAnswers)
//           : [];
          
//         // If we have a quiz ID, load the quiz using the student endpoint
//         if (this.result.quiz?.id) {
//           // Use the student endpoint instead of teacher endpoint
//           this.quizService.getQuizById(this.result.quiz.id).subscribe({
//             next: (quizData: Quiz) => {
//               console.log('Quiz data loaded:', quizData);
//               this.quiz = quizData;
//               this.loading = false;
//             },
//             error: (error) => {
//               console.error('Error loading quiz details', error);
//               this.error = 'Failed to load quiz details';
//               this.loading = false;
//             }
//           });
//         } else {
//           this.error = 'Quiz information missing from result';
//           this.loading = false;
//         }
//       },
//       error: (error) => {
//         console.error('Error loading result details', error);
//         this.error = 'Failed to load attempt details';
//         this.loading = false;
//       }
//     });
//   }
  
//   isCorrectAnswer(questionIndex: number, selectedOptionIndex: number): boolean {
//     if (!this.quiz?.questions || !this.result?.answersAsList) return false;
  
//     const question = this.quiz.questions[questionIndex];
//     if (!question) return false;
  
//     return (this.result.answersAsList[questionIndex] ?? -1) + 1 === question.correctOption;
//   }
  
//   getSelectedOptionText(questionIndex: number): string {
//     if (!this.quiz?.questions || !this.result?.answersAsList) return 'No answer provided';
  
//     const question = this.quiz.questions[questionIndex];
//     if (!question) return 'No options available';
  
//     const selectedOptionIndex = (this.result.answersAsList[questionIndex] ?? -1) - 1;
//     const options = [question.option1, question.option2, question.option3, question.option4];
  
//     return options[selectedOptionIndex] || 'Unknown option';
//   }
  

//   getCorrectOptionText(questionIndex: number): string {
//     if (!this.quiz?.questions) return 'Unknown';

//     const question = this.quiz.questions[questionIndex];
//     if (!question) return 'No options available';

//     const options = [question.option1, question.option2, question.option3, question.option4];

//     return options[question.correctOption - 1] || 'No correct answer defined';
//   }

//   navigateBack(): void {
//     this.router.navigate(['/quiz-results']);
//   }
// }
