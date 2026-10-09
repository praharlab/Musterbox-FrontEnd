import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-edit-tracking-outage-category-details',
    templateUrl: './edit-tracking-outage-category-details.component.html',
    styleUrls: ['./edit-tracking-outage-category-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditTrackingOutageCategoryDetailsComponent implements OnInit {

  @ViewChild('trackingCategoryDetails') trackingCategoryDetails: NgForm;

  trackingCatDetails: any = {
    categoryName: ''
  }
  formValue: any
  adminRoot = environment.adminRoot;
  selectedTrackingCategoryID: any
  trackingCategories: any
  // trackingCategoryDetails: any

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,
    private formValueStorageService: FormValueStorageService,
  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.getTrackingOutageCategories()
    this.editdata()
  }

  onSubmit() {
    this.trackingCategoryDetails.value.trackingCategoryID = this.trackingCatDetails.trackingCategoryID;
    if (!this.trackingCategoryDetails.valid) {
      return;
    }

    let body = {
      title: this.trackingCategoryDetails.value.title,
      description: this.trackingCategoryDetails.value.description,
      categoryDetailsID: this.trackingCatDetails.categoryDetailsID
    }

    this.spinner.start('submit');
    this.api.callApi(this.constant.UPDATETRACKINGCATEGORYDETAILS, body, 'PUT', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/superadminmenus/tracking-outage-category-details']);
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
    let categoryDetailsID = this.formValue.ListTrackingOutageCategoryDetailsComponent.id;
    this.spinner.start('edit');
    this.api
      .callApi(this.constant.GETTRACKINGCATEGORYDETAILSBYID + '/' + categoryDetailsID, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.trackingCatDetails = res.data;
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
}
