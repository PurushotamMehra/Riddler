import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LoginDTO } from '../models/login-dto';
import { JwtResponse } from '../models/jwt-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private tokenKey = 'auth_token';
  private usernameKey = 'username';
  private roleKey = 'user_role';
  private userIdKey = 'user_id';
  
  private currentUserSubject = new BehaviorSubject<any>(this.getCurrentUser());
  public currentUser = this.currentUserSubject.asObservable();
  
  constructor(private http: HttpClient) { }
  
  login(loginData: LoginDTO): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.apiUrl}/login`, loginData)
      .pipe(
        tap(response => {
          // Store auth data in localStorage
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem(this.usernameKey, response.username);
          localStorage.setItem(this.roleKey, response.role);
          localStorage.setItem(this.userIdKey, response.userId.toString()); // Save the userId
          
          // Update current user
          this.currentUserSubject.next({
            username: response.username,
            role: response.role,
            userId: response.userId // Include userId in the current user object
          });
        })
      );
  }
  
  logout(): void {
    // Clear all stored auth data
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usernameKey);
    localStorage.removeItem(this.roleKey);
    localStorage.removeItem(this.userIdKey);
    
    // Update current user to null
    this.currentUserSubject.next(null);
  }
  
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
  
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  
  getCurrentUser(): any {
    const username = localStorage.getItem(this.usernameKey);
    const role = localStorage.getItem(this.roleKey);
    
    if (username && role) {
      return { username, role };
    }
    return null;
  }
  
  getUserRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }
  
  setUserId(userId: string): void {
    localStorage.setItem(this.userIdKey, userId);
  }
  
  getUserId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }
  
  hasRole(role: string): boolean {
    const userRole = this.getUserRole();
    return userRole === role;
  }
}