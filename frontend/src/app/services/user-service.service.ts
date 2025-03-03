import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth-service.service';
// import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseApiUrl = 'http://localhost:8080/api';
  private adminUrl = `${this.baseApiUrl}/admin/users`;
  private teacherUrl = `${this.baseApiUrl}/teacher`;
  private studentUrl = `${this.baseApiUrl}/student`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Create a new user (admin only)
  createUser(user: any): Observable<any> {
    return this.http.post<any>(this.adminUrl, user);
  }

  getUserById(userId: number): Observable<any> {
    const role = this.authService.getUserRole();
    
    if (role === 'ADMIN') {
      return this.http.get<any>(`${this.adminUrl}/${userId}`);
    } else if (role === 'TEACHER') {
      // Change this line to use adminUrl instead of teacherUrl
      return this.http.get<any>(`${this.adminUrl}/${userId}`);
    } else {
      // For student role - can only get their own profile
      return this.getCurrentUserProfile();
    }
  }

  // Get current user's profile
  getCurrentUserProfile(): Observable<any> {
    const username = this.authService.getCurrentUser()?.username;
    return this.http.get<any>(`${this.baseApiUrl}/users/profile/${username}`);
  }

  // Update an existing user (with role-based restrictions)
  updateUser(user: any): Observable<any> {
    const role = this.authService.getUserRole();
    
    if (role === 'ADMIN') {
      return this.http.put<any>(`${this.adminUrl}/${user.id}`, user);
    } else {
      // For other roles - they can only update their own profile
      return this.http.put<any>(`${this.baseApiUrl}/users/profile`, user);
    }
  }

  // Get all users (admin only)
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.adminUrl);
  }

  // Get teachers and students (for teacher role)
  getTeachersAndStudents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.teacherUrl}/users`);
  }

  // Get only students (for teacher role)
  getStudents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.teacherUrl}/students`);
  }

  // Delete a user (admin only)
  deleteUser(userId: number): Observable<any> {
    return this.http.delete<any>(`${this.adminUrl}/${userId}`);
  }

  // Role-specific endpoints for quizzes
  getStudentQuizzes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.studentUrl}/quizzes`);
  }
  
  getTeacherQuizzes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.teacherUrl}/quizzes`);
  }
  
  // Get results for the current user (student)
  getStudentResults(): Observable<any[]> {
    const userId = this.authService.getUserId();
    return this.http.get<any[]>(`${this.studentUrl}/${userId}/results`);
  }
  
  // Get quiz results for a teacher
  getTeacherQuizResults(quizId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.teacherUrl}/quizzes/${quizId}/results`);
  }
  
  // Create a new quiz (teacher only)
  createQuiz(quiz: any): Observable<any> {
    return this.http.post<any>(`${this.teacherUrl}/quizzes`, quiz);
  }
}