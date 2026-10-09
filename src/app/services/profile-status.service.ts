import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileStatusService {
  private profileStatusRefreshSubject = new BehaviorSubject<boolean>(false);

  profileStatusRefresh$ = this.profileStatusRefreshSubject.asObservable();

  refreshProfileStatus() {
    this.profileStatusRefreshSubject.next(true);
  }

  clearAllProfileStatus() {
    // Reinitialize the BehaviorSubject
    this.profileStatusRefreshSubject = new BehaviorSubject<boolean>(false);
    this.profileStatusRefresh$ = this.profileStatusRefreshSubject.asObservable();
  }


}
