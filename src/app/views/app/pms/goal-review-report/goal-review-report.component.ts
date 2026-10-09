import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';

@Component({
    selector: 'app-goal-review-report',
    templateUrl: './goal-review-report.component.html',
    styleUrls: ['./goal-review-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class GoalReviewReportComponent implements OnInit {
  @ViewChild('formFilter') formFilter: NgForm;

  permissionview: any = [];
  company_id: any;
  company: any;
  companydata: any;
  performaceReviewData: any = [];
  employee: any = [];
  reportData: any;
  selectedCompany_id: number;
  emlpoyeeGoalData: any = [];

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
    this.getEmployeeGoalData(this.selectedCompany_id);
  }

  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.company = res.data;
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
              permissionval.formName == 'GoalReviewReport' &&
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
    this.getEmployeeGoalData(id);
  }

  getEmployeeGoalData(selectedId) {
    if (!selectedId) return;

    this.spinner.start('start');
    let queryString = `?companyMasterID=${selectedId}`;

    this.api
      .callApi(this.constant.GETALLEMPLOYEEGOAL + queryString, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          this.emlpoyeeGoalData = res.data;
          this.spinner.stop('start');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
  }

  clear() {
    this.formFilter.resetForm();
    this.reportData = ''
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }

  onSubmit() {
    if (!this.formFilter.valid) {
      return;
    }

    let queryString = `?employeeGoalId=${this.formFilter.value.employeeGoalID}`;
    this.spinner.start('download');
    this.api
      .callApi(
        this.constant.EMPLOYEEGOALREVIEWREPORT + queryString,
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
          this.handleError('No Data To Download!');
          this.spinner.stop('download');
        },
      );
  }

  onClickDownloadPdf() {
    if (this.reportData) {
      const link = document.createElement('a');
      link.href = this.reportData;
      link.download = 'GoalReviewReport.pdf';
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
