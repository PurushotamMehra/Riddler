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
import { RoleGuard, NoAuthGuard } from './helpers/gaurds/RoleGuard';
import { StudentResultsComponent } from './components/student-results/student-results.component';

const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [NoAuthGuard] // Use NoAuthGuard to prevent logged-in users from accessing login
  },
  { 
    path: 'users', 
    component: DisplayUsersComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN'] }
  },
  { 
    path: 'create-user', 
    component: CreateUserComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN'] }
  },
  { 
    path: 'update-user/:id', 
    component: UpdateUserComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN'] }
  },
  { 
    path: 'quizzes', 
    component: DisplayQuizzesComponent,
    canActivate: [RoleGuard],
    data: { roles: ['STUDENT'] } // Add STUDENT role explicitly
  },
  { 
    path: 'create-quiz', 
    component: CreateQuizComponent,
    canActivate: [RoleGuard],
    data: { roles: ['TEACHER'] }
  },
  { 
    path: 'take-quiz/:quizId', 
    component: TakeQuizComponent,
    canActivate: [RoleGuard],
    data: { roles: ['STUDENT'] }
  },
  { 
    path: 'view-quiz/:quizId', 
    component: ViewQuizComponent,
    canActivate: [RoleGuard],
    data: { roles: ['TEACHER', 'ADMIN'] }
  },
  { 
    path: 'result/:resultId', 
    component: QuizResultComponent,
    canActivate: [RoleGuard],
    data: { roles: ['TEACHER', 'ADMIN', 'STUDENT'] } // Add roles explicitly
  },
  { 
    path: 'quiz-results/:quizId', 
    component: ViewResultsComponent,
    canActivate: [RoleGuard],
    data: { roles: ['TEACHER', 'ADMIN', 'STUDENT'] }
  },
  { 
    path: 'teacher-quizzes', 
    component: TeacherViewQuizComponent,
    canActivate: [RoleGuard],
    data: { roles: ['TEACHER', 'ADMIN'] } // Add roles explicitly
  },
  { 
    path: 'user-list', 
    component: UserListComponent,
    canActivate: [RoleGuard],
    data: { roles: ['TEACHER'] }
  },
  { 
    path: 'attempt-details/:resultId', 
    component: QuizAttemptDetailsComponent,
    canActivate: [RoleGuard],
    data: { roles: ['TEACHER', 'STUDENT'] }
  },
  { 
    path: 'user-profile/:id', 
    component: UserProfileComponent,
    canActivate: [RoleGuard],
    data: { roles: ['TEACHER', 'ADMIN'] }
  },
  {
    path: 'my-results',
    component: StudentResultsComponent,
    canActivate: [RoleGuard],
    data: { roles: ['STUDENT'] } // Add STUDENT role explicitly
  },
  { 
    path: '', 
    redirectTo: '/login', 
    pathMatch: 'full'
  },
  // Add a catch-all route to redirect to appropriate dashboard
  { 
    path: '**', 
    redirectTo: '/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }