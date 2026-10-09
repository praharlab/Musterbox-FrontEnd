import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-add-performance-review',
    templateUrl: './add-performance-review.component.html',
    styleUrls: ['./add-performance-review.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddPerformanceReviewComponent implements OnInit {
  @ViewChild('addPerformanceReview') addPerformanceReview: NgForm;
  company_id: any;
  adminRoot = environment.adminRoot;
  reviewFormData: any;
  enddate: Date;
  comp: any = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    public activatedRoute: ActivatedRoute,
    private api: ApiService,
    private constant: ConstantService,
  ) {}

  ngOnInit(): void {
    this.company_id = +localStorage.getItem('company_id');
    this.getcompany();
    this.getReviewFormData(this.company_id);
  }

  selectfrom() {
    this.enddate = new Date();
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

    this.spinner.start('start');

    this.api
      .callApi(this.constant.CREATEPERFORMANCEREVIEW, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/pms/performanceReview']);
            this.spinner.stop('start');
          }, 3000);
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
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

  getReviewFormData(company_id: any) {
    this.spinner.start('company');
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
          this.spinner.stop('company');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('company');
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
