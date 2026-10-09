import { Injectable } from '@angular/core';
import {  BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private userRequestRefreshSubject = new BehaviorSubject<boolean>(false);

  userRequestRefresh$ = this.userRequestRefreshSubject.asObservable();

  refreshUserRequestStatus() {
    this.userRequestRefreshSubject.next(true);
  }
}
