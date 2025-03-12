// role.guard.ts
import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard {
  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Check if the user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
    
    // Get the required roles from the route data
    const requiredRoles = route.data['roles'] as Array<string>;
    
    // If no specific roles are required, redirect to login
    // This ensures no path is accessible without a specified role
    if (!requiredRoles || requiredRoles.length === 0) {
      this.router.navigate(['/login']);
      return false;
    }
    
    // Check if the user has one of the required roles
    const userRole = this.authService.getUserRole();
    const hasRequiredRole = requiredRoles.some(role => userRole === role);
    
    if (!hasRequiredRole) {
      // Redirect based on role
      if (userRole === 'STUDENT') {
        this.router.navigate(['/quizzes']);
      } else if (userRole === 'TEACHER' || userRole === 'ADMIN') {
        this.router.navigate(['/teacher-quizzes']);
      } else {
        // Fallback for any other roles
        this.router.navigate(['/login']);
      }
      return false;
    }
    
    return true;
  }
}

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard {
  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // If user is already logged in, redirect based on role
    if (this.authService.isLoggedIn()) {
      const userRole = this.authService.getUserRole();
      
      if (userRole === 'STUDENT') {
        this.router.navigate(['/quizzes']);
      } else if (userRole === 'TEACHER' || userRole === 'ADMIN') {
        this.router.navigate(['/teacher-quizzes']);
      } else {
        // Fallback for any unexpected roles
        this.router.navigate(['/login']);
      }
      return false;
    }
    
    // User is not logged in, allow access to login
    return true;
  }
}