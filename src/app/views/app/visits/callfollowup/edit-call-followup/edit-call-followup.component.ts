import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-call-followup',
    templateUrl: './edit-call-followup.component.html',
    styleUrls: ['./edit-call-followup.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditCallFollowupComponent implements OnInit {
  @ViewChild('editcallfollowup') editcallfollowup: NgForm;
  adminRoot = environment.adminRoot;
  country: any = [];
  state: any = [];
  city: any = [];
  finalcityid: any;
  file: any;
  format: any;
  url: any;
  ipAddress: any;
  allcustomer: any;
  callfollowupdata: any;
  datetime: string;
  formValue: any;

  constructor(
    public activatedRoute: ActivatedRoute,
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
  ) {}

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.getallcustomer();
    this.getIPAddress();
    this.editdata();
  }

  editdata() {
    let callfollowupid = this.formValue.ListCallFollowupComponent.id;
    this.spinner.start();
    this.api
      .callApi(this.constant.VIEWCALLFOLLOWUP + callfollowupid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.callfollowupdata = res.data;
          this.datetime = new Date(this.callfollowupdata.callDateTime).toISOString().slice(0, 16);
          this.callfollowupdata.customerCompanyID = +this.callfollowupdata.customerCompanyID
          this.spinner.stop();
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        },
      );
  }

  onSubmit() {
    if (!this.editcallfollowup.valid) {
      return;
    }
    let body = {
      callFollowUpID: this.callfollowupdata.callFollowUpID,
      customerCompanyID: this.editcallfollowup.value.customerCompanyID,
      callDateTime: this.editcallfollowup.value.callDateTime,
      estimatedTime: this.editcallfollowup.value.estimatedTime,
      remarks: this.editcallfollowup.value.remarks,
      contactPersonName: this.editcallfollowup.value.contactPersonName,
      contactPersonNumber: this.editcallfollowup.value.contactPersonNumber,
      userMasterID: localStorage.getItem('id'),
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api.callApi(this.constant.UPDATECALLFOLLOWUP, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/visits/callfollowup']);
            this.spinner.stop();
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        }
      },
      (err) => {
        this.notifications.create('Error', err.error.message, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop();
      },
    );
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  getallcustomer() {
    const body = {
      page: '',
      limit: '',
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.api
      .callApi(this.constant.getAllCUSTOMERDataByCompanyId, body, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.allcustomer = res.data;
          } else {
            this.notifications.create('Error', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop();
          }
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        },
      );
  }
}
