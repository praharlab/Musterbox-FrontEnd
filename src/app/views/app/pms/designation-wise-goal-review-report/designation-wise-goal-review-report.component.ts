import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';

@Component({
    selector: 'app-designation-wise-goal-review-report',
    templateUrl: './designation-wise-goal-review-report.component.html',
    styleUrls: ['./designation-wise-goal-review-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DesignationWiseGoalReviewReportComponent implements OnInit {
  @ViewChild('formFilter') formFilter: NgForm;

  permissionview: any = [];
  company_id: any;
  company: any;
  reportData: any;
  selectedCompany_id: number;
  designations: any;
  goal: any = [];

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
    this.selectCompany(this.selectedCompany_id);
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
              permissionval.formName == 'DesignationWiseGoalReviewReport' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  selectCompany(id) {
    if (!id) return;

    this.spinner.start('designation');
    this.api
      .callApi(this.constant.DESIGNATIONBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.designations = res.data;
            this.spinner.stop('designation');
          } else {
            this.handleError(res.message);
            this.spinner.stop('designation');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('designation');
        },
      );

    this.spinner.start('goal');
    this.api
      .callApi(this.constant.GETALLGOAL + '?companyMasterID=' + id, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          this.goal = res.data;
          this.spinner.stop('goal');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('goal');
        },
      );
  }

  clear() {
    this.formFilter.resetForm();
    this.reportData = '';
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }

  onSubmit() {
    if (!this.formFilter.valid) {
      return;
    }

    let queryString = `?designationID=${this.formFilter.value.designationId}&goalMasterId=${this.formFilter.value.goalMasterId}`;
    this.spinner.start('download');
    this.api
      .callApi(
        this.constant.DESIGNATIONWISEEMPLOYEEGOALREVIEWREPORT + queryString,
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
          this.reportData = ''
          this.handleError('No Data To Download!');
          this.spinner.stop('download');
        },
      );
  }

  onClickDownloadPdf() {
    if (this.reportData) {
      const link = document.createElement('a');
      link.href = this.reportData;
      link.download = 'GoalReviewReportDesignationWise.pdf';
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
