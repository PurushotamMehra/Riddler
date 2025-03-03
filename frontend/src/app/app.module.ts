import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { CreateQuizComponent } from './components/create-quiz/create-quiz.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TakeQuizComponent } from './components/take-quiz/take-quiz.component';
import { DisplayQuizzesComponent } from './components/display-quizzes/display-quizzes.component';
import { UpdateUserComponent } from './components/update-user/update-user.component';
import { DisplayUsersComponent } from './components/display-users/display-users.component';
import { QuizResultComponent } from './components/quiz-result/quiz-result.component';
import { TeacherViewQuizComponent } from './components/teacher-view-quiz/teacher-view-quiz.component';
import { ViewResultsComponent } from './components/view-results/view-results.component';
import { QuizAttemptDetailsComponent } from './components/quiz-attempt-details/quiz-attempt-details.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ViewQuizComponent } from './components/view-quiz/view-quiz.component';
import { JwtInterceptor } from './helpers/interceptors /JwtInterceptor';
import { RouterModule } from '@angular/router';
import { StudentResultsComponent } from './components/student-results/student-results.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CreateUserComponent,
    CreateQuizComponent,
    TakeQuizComponent,
    DisplayQuizzesComponent,
    UpdateUserComponent,
    DisplayUsersComponent,
    QuizResultComponent,
    TeacherViewQuizComponent,
    ViewResultsComponent,
    QuizAttemptDetailsComponent,
    UserListComponent,
    UserProfileComponent,
    ViewQuizComponent,
    StudentResultsComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NavbarComponent
],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
