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
    selector: 'app-edit-employee-performance-review',
    templateUrl: './edit-employee-performance-review.component.html',
    styleUrls: ['./edit-employee-performance-review.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditEmployeePerformanceReviewComponent implements OnInit {
  @ViewChild('addEmployeePerformanceReview') addEmployeePerformanceReview: NgForm;
  company_id: any;
  adminRoot = environment.adminRoot;
  performaceReviewFData: any;
  enddate: Date;
  comp: any = [];

  values = [];
  i: any;
  value: any;
  employee: any;
  reviewrs: any;
  employeePerformaceReviewData: any = [];
  formValue: any;


  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    public activatedRoute: ActivatedRoute,
    private api: ApiService,
    private constant: ConstantService,
    private formValueStorageService: FormValueStorageService,

  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.getEmployeePerformaceReviewData();
    this.getcompany();
  }

  getEmployeePerformaceReviewData() {
    this.spinner.start('start1');
    this.api
      .callApi(
        this.constant.GETONEEMPLOYEEPERFORMANCEREVIEW + this.formValue.ListEmployeePerformanceReviewComponent.id,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          this.employeePerformaceReviewData = res.data;
          this.value = {
            companyMasterID: this.employeePerformaceReviewData.performanceReview.companyMasterId,
            performanceReviewId: this.employeePerformaceReviewData.performanceReviewId,
            revieweeId: this.employeePerformaceReviewData.reviewee.userMasterID,
            reviewerId: this.employeePerformaceReviewData.reviewer.userMasterID,
            notes: this.employeePerformaceReviewData.notes,
          };
          setTimeout(() => {
            this.selectcompany(this.employeePerformaceReviewData.performanceReview.companyMasterId);
          }, 100);

          this.spinner.stop('start1');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('start1');
        },
      );
  }

  selectcompany(id) {
    if (!id) {
      return;
    }

    this.getPerformaceReviewData(id);
    this.getEmployee(id);
  }

  getcompany() {
    this.spinner.start('company');
    this.api
      .callApi(
        this.constant.GETALLCOMPANYBYID,
        {
          companyMasterID: localStorage.getItem('company_id'),
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

  getEmployee(id) {
    if (!id) return;

    let bb = {
      page: '',
      limit: '',
      companyMasterID: id,
    };
    this.spinner.start('user');
    this.api.callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.employee = res.data;
          this.reviewrs = res.data;
          this.spinner.stop('user');
        } else {
          this.handleError('Something Went Wrong!');
          this.spinner.stop('user');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('user');
      },
    );
  }

  getPerformaceReviewData(company_id: any) {
    this.spinner.start('data');
    this.api
      .callApi(
        this.constant.GETALLPERFORMANCEREVIEW + `?companyMasterID=${company_id}`,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          this.performaceReviewFData = res.data;
          this.spinner.stop('data');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('data');
        },
      );
  }

  onSubmit() {
    if (!this.addEmployeePerformanceReview.valid) {
      return;
    }

    const body = {
      revieweeId: this.addEmployeePerformanceReview.value.revieweeId,
      reviewerId: this.addEmployeePerformanceReview.value.reviewerId,
      performanceReviewId: this.addEmployeePerformanceReview.value.performanceReviewId,
      isCompleted: false,
    };

    if (this.addEmployeePerformanceReview.value.notes) {
      body['notes'] = this.addEmployeePerformanceReview.value.notes;
    }

    this.spinner.start('start');
    this.api
      .callApi(
        this.constant.UPDATEEMPLOYEEPERFORMANCEREVIEW + this.formValue.ListEmployeePerformanceReviewComponent.id,
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
            this.router.navigate([this.adminRoot + '/pms/setPerformanceReview']);
            this.spinner.stop('start');
          }, 3000);
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
