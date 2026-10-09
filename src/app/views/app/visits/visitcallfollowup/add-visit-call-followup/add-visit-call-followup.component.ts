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
    selector: 'app-add-visit-call-followup',
    templateUrl: './add-visit-call-followup.component.html',
    styleUrls: ['./add-visit-call-followup.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddVisitCallFollowupComponent implements OnInit {
  @ViewChild('addcallfollowup') addcallfollowup: NgForm;
  country: any = [];
  state: any = [];
  city: any = [];
  finalcityid: any;
  file: any;
  format: any;
  url: any;
  ipAddress: any;
  allcustomer: any;
  editvisitdata: any;
  formValue: any;

  adminRoot = environment.adminRoot;

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

  onSubmit() {
    if (!this.addcallfollowup.valid) {
      return;
    }
    let body = {
      visitID: this.formValue.ListVisitCallFollowupComponent.id,
      customerCompanyID: this.addcallfollowup.value.customerCompanyID,
      callDateTime: this.addcallfollowup.value.callDateTime,
      estimatedTime: this.addcallfollowup.value.estimatedTime,
      remarks: this.addcallfollowup.value.remarks,
      contactPersonName: this.addcallfollowup.value.contactPersonName,
      contactPersonNumber: this.addcallfollowup.value.contactPersonNumber,
      userMasterID: localStorage.getItem('id'),
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api.callApi(this.constant.CREATECALLFOLLOWUP, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/visits/listvisitcallfollowup']);

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
        this.notifications.create('Error', err, NotificationType.Bare, {
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
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allcustomer = res.data;
        }
      });
  }

  editdata() {
    let visitid = this.formValue.ListVisitCallFollowupComponent.id;
    this.spinner.start();
    this.api
      .callApi(this.constant.VIEWVISIT + visitid, {}, 'GET', false, true, true)
      .subscribe((res: any) => {
        this.editvisitdata = res.data;
      });
  }
}
