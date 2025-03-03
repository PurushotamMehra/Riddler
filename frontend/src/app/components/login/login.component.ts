import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Check if user is already logged in and redirect based on role
    if (this.authService.isLoggedIn()) {
      const userRole = this.authService.getUserRole();
      
      if (userRole === 'STUDENT') {
        this.router.navigate(['/quizzes']);
      } else if (userRole === 'TEACHER' || userRole === 'ADMIN') {
        this.router.navigate(['/view-quiz']);
      }
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          // No need to set these manually as your AuthService already does this
          // localStorage.setItem('token', response.token);
          // localStorage.setItem('role', response.role);
          // localStorage.setItem('username', response.username);
          
          console.log('Token:', response.token);
          console.log('Role:', response.role);
          console.log('Username:', response.username);
          
          // Redirect based on user role
          if (response.role === 'STUDENT') {
            this.router.navigate(['/quizzes']);
          } else {
            // For ADMIN and TEACHER roles
            this.router.navigate(['/teacher-quizzes']);
          }
        },  
        error: (error) => {
          console.error('Login failed:', error);
          this.errorMessage = 'Invalid credentials. Please try again.';
        }
      });
    }
  }
}