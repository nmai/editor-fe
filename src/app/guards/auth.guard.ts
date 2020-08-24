import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FireService } from '../services/fire.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private fireService: FireService, private router: Router) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    let loginStatus = await this.fireService.login();
    if (! loginStatus.success) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
