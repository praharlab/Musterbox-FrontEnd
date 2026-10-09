import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { environment } from 'src/environments/environment';


@Component({
    selector: 'app-edit-attendance-correction-reason',
    templateUrl: './edit-attendance-correction-reason.component.html',
    styleUrls: ['./edit-attendance-correction-reason.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditAttendanceCorrectionReasonComponent implements OnInit {

  @ViewChild('datefilter') datefilter: NgForm;
  editData: any = {
    reason: '',
    companyMasterID: null
  };
  company: any = [];
  attendanceCorrectionReasonID: any;
  gatepass: any;
  buttonDisabled = false;
  buttonState = '';
  adminRoot = environment.adminRoot;
  employee: any;
  formValue: any;
  company_id: any;
  usertype: any;

  constructor(private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    public activatedRoute: ActivatedRoute,
    private api: ApiService,
    private constant: ConstantService,
    private formValueStorageService: FormValueStorageService,) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.editdata();
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

  editdata() {
    let id = this.formValue.ListAttendanceCorrectionReasonComponent.id;
    this.attendanceCorrectionReasonID = id;

    this.spinner.start('start');
    this.api
      .callApi(this.constant.GETATTENDANCEDATABYREASONID + id, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          if (res.data) {    
            this.editData = res.data;
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
    if (!this.datefilter.valid) {
      return;
    }

    const body = {
      reason: this.datefilter.value.reason,
      attendanceCorrectionReasonID: this.attendanceCorrectionReasonID
    };

    this.spinner.start('sumbit');

    this.api
      .callApi(this.constant.EDITATTENDANCEDATABYREASON, body, 'PUT', true, true, true)
      .subscribe(
        (res: any) => {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
            this.router.navigate([this.adminRoot + '/masters/attendaceCorrectionReason']);
            this.spinner.stop('sumbit');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('sumbit');
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
