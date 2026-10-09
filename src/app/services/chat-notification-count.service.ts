import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatNotificationCountService {
  private refreshSubject = new Subject<void>();
  refreshComponent$ = this.refreshSubject.asObservable();

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  private ischatBotSubject = new BehaviorSubject<boolean>(false);
  isChatBot$: Observable<boolean> = this.ischatBotSubject.asObservable();

  chatServiceFunction(): void {
    // Add your logic here
    this.refreshSubject.next(); // Notify subscribers to refresh
  }

  // Authentication functions
  login(): void {
    // Add your login logic here
    this.isLoggedInSubject.next(true);
  }

  logout(): void {
    // Add your logout logic here
    this.isLoggedInSubject.next(false);
  }

  chatBotShow(): void {
    this.ischatBotSubject.next(true);
  }

  chatBotHide(): void {
    this.ischatBotSubject.next(false);
  }

  get ischatBot(): boolean {
    return this.ischatBotSubject.value;
  }

  get isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }
}
