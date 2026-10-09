import { Injectable } from '@angular/core';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CommonNotificationService {
  constructor(public activatedRoute: ActivatedRoute, private notifications: AppNotificationService) {}
  handleError(message: any, tag: any = 'Error') {
    this.notifications.create(tag, message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  handleWarning(message: any, tag: any = 'Warning') {
    this.notifications.create(tag, message, NotificationType.Warn, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
  handleSuccess(message: any, tag: any = 'Done') {
    this.notifications.create(tag, message, NotificationType.Bare, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: true,
    });
  }
}
