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
    
    // If no specific roles are required, just check if logged in
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    
    // Check if the user has one of the required roles
    const userRole = this.authService.getUserRole();
    const hasRequiredRole = requiredRoles.some(role => userRole === role);
    
    if (!hasRequiredRole) {
      // Redirect to unauthorized or dashboard based on your app's needs
      this.router.navigate(['/unauthorized']);
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
      } else {
        // For ADMIN and TEACHER roles
        this.router.navigate(['/view-quiz']);
      }
      return false;
    }
    
    return true;
  }
}