import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-add-tracking-outage-category-details',
    templateUrl: './add-tracking-outage-category-details.component.html',
    styleUrls: ['./add-tracking-outage-category-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddTrackingOutageCategoryDetailsComponent implements OnInit {
  @ViewChild('trackingCategoryDetails') trackingCategoryDetails: NgForm;

  adminRoot = environment.adminRoot;
  trackingCategories: any = []
  selectedTrackingCategoryID: any

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
  ) { }

  ngOnInit(): void {
    this.getTrackingOutageCategories()
  }

  onSubmit() {
    if (!this.trackingCategoryDetails.valid) {
      return;
    }
    let body = {
      title: this.trackingCategoryDetails.value.title,
      description: this.trackingCategoryDetails.value.description,
      trackingCategoryID: this.trackingCategoryDetails.value.TrackingCategoryId
    };

    this.spinner.start('add');
    this.api.callApi(this.constant.ADDTRACKINGCATEGORYDETAILS, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.spinner.stop('add');
            this.router.navigate([this.adminRoot + '/superadminmenus/tracking-outage-category-details']);
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('add');
        }
      },
      (err) => {
        this.notifications.create('Error', err.error.message, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop('add');
      },
    );
  }

  getTrackingOutageCategories() {
    this.spinner.start('data');
    this.api
      .callApi(this.constant.GETTRACKINGOUTAGECATEGORIES, {}, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.trackingCategories = res.data;
            this.spinner.stop('data');
          } else {
            this.handleError(res.message);
            this.spinner.stop('data');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('data');
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

}
