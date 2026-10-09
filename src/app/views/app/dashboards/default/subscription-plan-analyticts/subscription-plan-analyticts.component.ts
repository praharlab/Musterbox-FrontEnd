import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { NavigationStart, Router } from '@angular/router';

@Component({
    selector: 'app-subscription-plan-analyticts',
    templateUrl: './subscription-plan-analyticts.component.html',
    styleUrls: ['./subscription-plan-analyticts.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SubscriptionPlanAnalytictsComponent implements OnInit {
  // Must be an array: the template iterates it with *ngFor. Initialising this
  // as {} made NgFor throw "Cannot find a differ supporting object
  // '[object Object]'" on every render of the default dashboard.
  rows: any[] = [];
  showloader: any = 'true';
  adminRoot = environment.adminRoot;

  constructor(
    private api: ApiService,
    private notifications: AppNotificationService,
    private constant: ConstantService,
    private formValueStorageService: FormValueStorageService,
    private router: Router,

  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [this.adminRoot + '/dashboards/default', this.adminRoot + '/superadminmenus/listSubscriptionPlanAnalyticts'];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('SubscriptionPlanAnalytictsComponent', false);
        }
      }
    });
  }

  ngOnInit() {
    this.getdata();
  }

  getdata() {
    this.showloader = 'true';
    this.api
      .callApi(this.constant.GETCOMPANYSUBSCRIPTIONPLANANALYTICSDATA, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.showloader = 'false';
          // guard the response too - a non-array payload would reintroduce the
          // same NgFor crash
          this.rows = Array.isArray(res.data) ? res.data : [];
        },
        (err) => {
          this.showloader = 'false';
          this.rows = [];
          this.handleError(err?.error?.message);
        },
      );
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'SubscriptionPlanAnalytictsComponent',
      {},
      '/superadminmenus/listSubscriptionPlanAnalyticts',
      rowData.productMaster.productMasterID,
    );
  }
}
