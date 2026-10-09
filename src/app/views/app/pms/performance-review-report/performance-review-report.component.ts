import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';

@Component({
    selector: 'app-performance-review-report',
    templateUrl: './performance-review-report.component.html',
    styleUrls: ['./performance-review-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PerformanceReviewReportComponent implements OnInit {
  @ViewChild('formFilter') formFilter: NgForm;

  permissionview: any = [];
  company_id: any;
  company: any;
  companydata: any;
  performaceReviewData: any = [];
  employee: any = [];
  reportData: any;
  selectedCompany_id: number;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
  ) { }

  ngOnInit() {
    this.selectedCompany_id = +localStorage.getItem('company_id');

    this.company_id = localStorage.getItem('company_id');
    this.checkpermission();
    this.getcompany();
    this.getPerformanceReview(this.selectedCompany_id);
    this.getEmployee(this.selectedCompany_id);

  }

  getPerformanceReview(selectedId) {
    if (!selectedId) return;
    this.spinner.start('start');
    this.api
      .callApi(
        this.constant.GETALLPERFORMANCEREVIEW + `?companyMasterID=${selectedId}`,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          this.performaceReviewData = res.data;
          this.spinner.stop('start');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
  }

  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start('company');
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.company = res.data;
          this.spinner.stop('company');
        } else {
          this.handleError('Something Went Wrong!')
          this.spinner.stop('company');

        }
      }, (err) => {
        this.handleError(err.error.message)
        this.spinner.stop('company');

      });
  }

  checkpermission() {
    this.spinner.start();
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          let permission = res.data;
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'PerformanceReviewReport' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  selectcompany(id) {
    if (!id) return;

    this.performaceReviewData = [];

    this.getPerformanceReview(id);
    this.getEmployee(id);
  }

  getEmployee(selectedId) {
    if (!selectedId) return;

    let bb = {
      page: '',
      limit: '',
      companyMasterID: selectedId,
    };
    this.spinner.start('employee');
    this.api
      .callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.employee = res.data;
          this.spinner.stop('employee');

        } else {
          this.handleError('Something Went Wrong!')
          this.spinner.stop('employee');

        }
      }, (err) => {
        this.handleError(err.error.message)
        this.spinner.stop('employee');

      });
  }

  clear() {
    this.formFilter.resetForm();

    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }

  onSubmit() {
    if (!this.formFilter.valid) {
      return;
    }

    let body = {
      companyMasterId: this.formFilter.value.companyMasterId,
      performanceReviewId: this.formFilter.value.performanceReviewId,
      revieweeId: this.formFilter.value.revieweeId,
      reviewerId: this.formFilter.value.reviewerId,
    };

    let queryString = `?companyMasterID=${body.companyMasterId}`;

    if (body.performanceReviewId) {
      queryString += `&performanceReviewId=${body.performanceReviewId}`;
    }

    if (body.revieweeId) {
      queryString += `&revieweeId=${body.revieweeId}`;
    }

    if (body.reviewerId) {
      queryString += `&userMasterID=${body.reviewerId}`;
    }

    this.spinner.start('download');
    this.api
      .callApi(
        this.constant.EMPLOYEEPERFORMANCEREVIEWREPORT + queryString,
        {},
        'GET',
        true,
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          var blob = new Blob([res], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          this.reportData = url;
          this.spinner.stop('download');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('download');
        },
      );
  }

  onClickDownloadPdf() {
    if (this.reportData) {
      const link = document.createElement('a');
      link.href = this.reportData;
      link.download = 'PerformaceReviewReport.pdf';
      link.click();
    } else {
      this.notifications.create('Error', 'PDF data is not available.', NotificationType.Error, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });
    }
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
