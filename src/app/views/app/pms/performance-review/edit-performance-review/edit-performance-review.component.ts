import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-performance-review',
    templateUrl: './edit-performance-review.component.html',
    styleUrls: ['./edit-performance-review.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditPerformanceReviewComponent implements OnInit {
  @ViewChild('addPerformanceReview') addPerformanceReview: NgForm;
  editData: any;
  company_id: any;
  employee: any;
  adminRoot = environment.adminRoot;
  reviewFormData: any;
  enddate: Date;
  comp: any = [];
  formValue: any;


  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    public activatedRoute: ActivatedRoute,
    private api: ApiService,
    private constant: ConstantService,
    private formValueStorageService: FormValueStorageService,

  ) {}

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.company_id = +localStorage.getItem('company_id');
    this.getEditData();
    this.getcompany();
    this.getReviewFormData(this.company_id);
  }

  selectfrom() {
    this.enddate = new Date();
  }

  getEditData() {
    this.spinner.start('start');
    this.api
      .callApi(
        this.constant.GETONEPERFORMANCEREVIEW + this.formValue.ListPerformanceReviewComponent.id,
        {},
        'GET',
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.data) {
            this.editData = res.data;
            this.getReviewFormData(this.editData.companyMasterId);
          }
          this.spinner.stop('start');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
  }

  onSubmit() {
    if (!this.addPerformanceReview.valid) {
      return;
    }

    let body = {
      title: this.addPerformanceReview.value.title,
      status: this.addPerformanceReview.value.status,
      startDate: this.addPerformanceReview.value.fromdate,
      endDate: this.addPerformanceReview.value.todate,
      companyMasterID: this.addPerformanceReview.value.companyMasterID,
      reviewFormId: this.addPerformanceReview.value.reviewID,
    };


    
    if (this.addPerformanceReview.value.description)
      body['description'] = this.addPerformanceReview.value.description;

    this.spinner.start('submit');
    this.api
      .callApi(
        this.constant.UPDATEPERFORMANCEREVIEW + this.formValue.ListPerformanceReviewComponent.id,
        body,
        'PUT',
        true,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/pms/performanceReview']);
            this.spinner.stop('submit');
          }, 3000);
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('submit');
        },
      );
  }

  getcompany() {
    this.spinner.start('company');
    this.api
      .callApi(
        this.constant.GETALLCOMPANYBYID,
        {
          companyMasterID: this.company_id,
        },
        'POST',
        false,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.comp = res.data;
            this.spinner.stop('company');
          } else {
            this.handleError('Something Went Wrong!');
            this.spinner.stop('company');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('company');
        },
      );
  }

  getReviewFormData(company_id: any) {
    this.spinner.start('start');
    this.api
      .callApi(
        this.constant.GETALLREVIEWFORM + `?companyMasterID=${company_id}`,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          this.reviewFormData = res.data;
          this.spinner.stop('start');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('start');
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
