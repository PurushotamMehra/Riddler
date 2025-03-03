import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtResponse } from '../models/jwt-response';
import { LoginDTO } from '../models/login-dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth/login'; // Update this with your actual endpoint

  constructor(private http: HttpClient) {}

  login(credentials: LoginDTO): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(this.apiUrl, credentials);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
