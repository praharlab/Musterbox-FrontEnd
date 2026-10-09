import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard  {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }
  async canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean> {
    const currentUser = localStorage.getItem('token');

    if (currentUser) {
      // if (route.data && route.data.roles) {
      //   if (route.data.roles.includes(currentUser.role)) {
      //     return true;
      //   } else {
      //     this.router.navigate(['/unauthorized']);
      //     return false;
      //   }
      // } else {
      return true;
      // }
    } else {
      const currentUrl = state.url;

      if (currentUrl.startsWith('/app/attendances/leave_auth_request')) {
        localStorage.setItem('leavemngt', currentUrl);
      }

      this.router.navigate(['/user/login']);
      return false;
    }
  }
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const currentUser = await this.authService.getUser();
    if (currentUser) {
      if (route.data && route.data.roles) {
        if (route.data.roles.includes(currentUser.role)) {
          return true;
        } else {
          this.router.navigate(['/unauthorized']);
          return false;
        }
      } else {
        return true;
      }
    } else {
      this.router.navigate(['/user/login']);
      return false;
    }
  }
}
