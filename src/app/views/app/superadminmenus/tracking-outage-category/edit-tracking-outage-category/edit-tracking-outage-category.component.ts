import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-edit-tracking-outage-category',
    templateUrl: './edit-tracking-outage-category.component.html',
    styleUrls: ['./edit-tracking-outage-category.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditTrackingOutageCategoryComponent implements OnInit {

  @ViewChild('trackingCategory') trackingCategory: NgForm;

  trackingCatData:any = {
    categoryName: ''
  }
  formValue: any
  adminRoot = environment.adminRoot;

constructor(
      private spinner: NgxUiLoaderService,
      private router: Router,
      private notifications: AppNotificationService,
      private api: ApiService,
      private constant: ConstantService,
      public activatedRoute: ActivatedRoute,
      private formValueStorageService: FormValueStorageService,
    ) {}

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.editdata()
  }

  onSubmit(){
    if (!this.trackingCategory.valid) {
      return;
    }

    let body = {
      categoryName: this.trackingCategory.value.categoryName,
      trackingCategoryID: this.trackingCatData.trackingCategoryID
    }

    this.spinner.start('submit');
    this.api.callApi(this.constant.UPDATETRACKINGOUTAGECATEGORIES, body, 'PUT', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/superadminmenus/tracking-outage-category']);
            this.spinner.stop('submit');
          }, 3000);
        } else {
          this.handleError(res.message);
          this.spinner.stop('submit');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('submit');
      },
    );
  }

  editdata() {
    let trackingCategoryID = this.formValue.ListTrackingOutageCategoryComponent.id;
    this.spinner.start('edit');
    this.api
      .callApi(this.constant.GETTRACKINGOUTAGECATEGORIESBYID + '/' + trackingCategoryID, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.trackingCatData = res.data;
          this.spinner.stop('edit');
        },
        (err) => {
          this.spinner.stop('edit');
          this.handleError(err.error.message);
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
