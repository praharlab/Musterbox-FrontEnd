// import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-add-attendance-correction-reason',
    templateUrl: './add-attendance-correction-reason.component.html',
    styleUrls: ['./add-attendance-correction-reason.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddAttendanceCorrectionReasonComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  company_id: any;
  company: any = [];
  usertype: any;
  adminRoot = environment.adminRoot;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    // private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.company_id = Number(localStorage.getItem('company_id'));
    this.getcompany();
  }

  getcompany() {
    if (this.usertype == 2) {
      const body = {
        page: '',
        limit: '',
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETCOMPANYDATA, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.company = res.data;
            this.spinner.stop();
          }
        });
    } else {
      const body = {
        companyMasterID: this.company_id,
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.company = res.data;

            this.spinner.stop();
          }
        });
    }
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }
    this.spinner.start('start');

    const body = {
      reason: this.datefilter.value.reason,
      companyMasterID: this.company_id,
    };

    this.api
      .callApi(this.constant.ADDATTENDANCECORRECTIONREASON, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status === 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.router.navigate([this.adminRoot + '/masters/attendaceCorrectionReason']);
            this.spinner.stop('start');
          }
          else {
            this.handleError(res.message);
          }
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

  cancel() {
    this.router.navigate([this.adminRoot + '/masters/attendaceCorrectionReason']);
  }
}
