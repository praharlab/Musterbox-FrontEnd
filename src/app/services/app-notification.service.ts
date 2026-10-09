import { Injectable } from '@angular/core';
import { NotificationsService, NotificationType as LibNotificationType } from 'angular2-notifications';

// The app's own notification types, so components don't depend on angular2-notifications directly.
// Values match angular2-notifications 9 so existing calls behave the same.
export enum NotificationType {
  Success = 'success',
  Error = 'error',
  Alert = 'alert',
  Info = 'info',
  Warn = 'warn',
  Bare = 'bare',
}

export interface AppNotificationOptions {
  theClass?: string;
  timeOut?: number;
  showProgressBar?: boolean;
  pauseOnHover?: boolean;
  clickToClose?: boolean;
  [key: string]: any;
}

/**
 * Single entry point for toast notifications.
 * All components go through this service; to replace angular2-notifications
 * (unmaintained, see docs/10-angular-migration-plan.md §3.2) only this file changes.
 */
@Injectable({
  providedIn: 'root',
})
export class AppNotificationService {
  constructor(private notifications: NotificationsService) {}

  create(
    title?: any,
    content?: any,
    type: NotificationType = NotificationType.Success,
    override?: AppNotificationOptions,
    context?: any,
  ): void {
    this.notifications.create(title, content, type as unknown as LibNotificationType, override, context);
  }
}
