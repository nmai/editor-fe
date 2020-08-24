import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthState } from '../types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    let loginStatus = await this.authService.waitAuthDecision();
    if (loginStatus == AuthState.Unauthenticated) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
