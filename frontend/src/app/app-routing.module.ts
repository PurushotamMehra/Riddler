import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisplayQuizzesComponent } from './components/display-quizzes/display-quizzes.component';
import { DisplayUsersComponent } from './components/display-users/display-users.component';
import { UpdateUserComponent } from './components/update-user/update-user.component';
import { TakeQuizComponent } from './components/take-quiz/take-quiz.component';
import { QuizResultComponent } from './components/quiz-result/quiz-result.component';
import { ViewResultsComponent } from './components/view-results/view-results.component';
import { TeacherViewQuizComponent } from './components/teacher-view-quiz/teacher-view-quiz.component';
import { QuizAttemptDetailsComponent } from './components/quiz-attempt-details/quiz-attempt-details.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { ViewQuizComponent } from './components/view-quiz/view-quiz.component';
import { CreateQuizComponent } from './components/create-quiz/create-quiz.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path : '', redirectTo:'/login', pathMatch:'full'},
  { path: 'login', component:LoginComponent},
  { path: 'users', component: DisplayUsersComponent },
  { path: 'create-user', component: CreateUserComponent },
  { path: 'update-user/:id', component: UpdateUserComponent },
  { path: 'quizzes', component: DisplayQuizzesComponent },
  { path: 'create-quiz', component: CreateQuizComponent },
  { path: 'take-quiz/:quizId', component: TakeQuizComponent },
  { path: 'view-quiz/:quizId', component: ViewQuizComponent },
  { path: 'result/:resultId', component: QuizResultComponent },

  { path: 'quiz-results/:quizId', component: ViewResultsComponent },
  { path: 'teacher-quizzes', component:TeacherViewQuizComponent},
  { path: 'user-list', component:UserListComponent},
  { path: 'attempt-details/:resultId', component:QuizAttemptDetailsComponent},
  { path: 'user-profile/:id', component:UserProfileComponent} 
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
