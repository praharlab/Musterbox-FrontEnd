import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { CustomJwtPayload } from '../constants/loginGuardModel';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard  {
  constructor(
    private router: Router,
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // return true;

    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode<CustomJwtPayload>(token).token;
      if (decodedToken && decodedToken.userType) {
        if (decodedToken.userType == '0' || decodedToken.userType == '1') {
          return this.router.navigate(['/app/dashboards/analytics']);
        } else if (decodedToken.userType == '2' || decodedToken.userType == '3') {
          return this.router.navigate(['/app/dashboards']);
        } else if (decodedToken.userType == '4') {
          return this.router.navigate(['/app/masters/company_master']);
        }
      }
      else {
        return true;
      }
    } else {
      return true;
    }

  }

}