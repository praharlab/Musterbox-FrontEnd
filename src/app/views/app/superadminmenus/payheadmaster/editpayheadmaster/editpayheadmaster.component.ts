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
    selector: 'app-editpayheadmaster',
    templateUrl: './editpayheadmaster.component.html',
    styleUrls: ['./editpayheadmaster.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditpayheadmasterComponent implements OnInit {
  @ViewChild('addpayhead') addpayhead: NgForm;
  country: any = [];
  state: any = [];
  city: any = [];
  finalcityid: any;
  file: any;
  format: any;
  url: any;
  ipAddress: any;
  product: any = [];
  usertype: any;
  company_id: any;
  companydata: any;
  isdisebled: boolean = false;
  adminRoot = environment.adminRoot;
  formValue: any;


  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    public activatedRoute: ActivatedRoute,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
  ) {}

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getIPAddress();
    this.editdata();
  }

  editdata() {
    let companyid = this.formValue.ListpayheadmasterComponent.id;
    this.spinner.start('edit');
    this.api
      .callApi(this.constant.GETPAYHEADBYID + '/' + companyid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.companydata = res.data;
          this.spinner.stop('edit');
        },
        (err) => {
          this.spinner.stop('edit');
          this.handleError(err.error.message);
        },
      );
  }

  onSubmit() {
    if (!this.addpayhead.valid) {
      return;
    }

    let body = {
      payheadMasterID: this.formValue.ListpayheadmasterComponent.id,
      payheadName: this.addpayhead.value.payheadname,
      payheadDesc: this.addpayhead.value.payheadDesc,
      status: '1',
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
      taxApplicability:this.companydata.taxApplicability
    };
    this.isdisebled = true;
    this.spinner.start();
    this.api.callApi(this.constant.UPDATEPAYHEAD, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/superadminmenus/payheadmaster']);
            this.spinner.stop();
            this.isdisebled = false;
          }, 3000);
        } else {
          this.handleError(res.message);
          this.spinner.stop();
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop();
      },
    );
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
