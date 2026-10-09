import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompanyLogoService {
  private companyLogoSubject = new BehaviorSubject<string>(''); // Initial value can be null or a default logo
  companyLogo$ = this.companyLogoSubject.asObservable(); // Observable to subscribe to

  constructor() {}

  setCompanyLogo(image: string): void {
    if(image){
      this.companyLogoSubject.next(image); // Update the BehaviorSubject
    }
  }

  getCompanyLogo(): string {
    return this.companyLogoSubject.value; // Get the current value
  }
}
