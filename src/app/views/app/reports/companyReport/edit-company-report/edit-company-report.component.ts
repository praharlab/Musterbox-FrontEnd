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
    selector: 'app-edit-company-report',
    templateUrl: './edit-company-report.component.html',
    styleUrls: ['./edit-company-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditCompanyReportComponent implements OnInit {
  @ViewChild('addcompanyreport') addcompanyreport: NgForm;
  country: any = [];
  state: any = [];
  city: any = [];
  finalcityid: any;
  file: any;
  format: any;
  url: any;
  ipAddress: any;
  values: any = [];
  allcomp: any;
  reportdata: any;
  adminRoot = environment.adminRoot;
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

    this.getIPAddress();
    this.getcompany();
    this.editdata();
  }
  editdata() {
    let reportid = this.formValue.ListCompanyReportComponent.id;
    this.spinner.start();
    this.api
      .callApi(this.constant.VIEWCOMPANYREPORT + reportid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.reportdata = res.data;
          var respo: any = [];
          for (var i = 0; i < this.reportdata.params.length; i++) {
            respo.push({ value: this.reportdata.params[i] });
          }
          this.values = respo;
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
  add() {
    this.values = [];
  }
  removevalue(i) {
    this.values.splice(i, 1);
  }

  addvalue() {
    this.values.push({ value: '' });
  }
  onSubmit() {
    const resp = [];
    for (var i = 0; i < this.values.length; i++) {
      resp.push(this.values[i].value);
    }
    if (!this.addcompanyreport.valid) {
      return;
    }
    let body = {
      companywiseReportID: this.formValue.ListCompanyReportComponent.id,
      functionName: this.addcompanyreport.value.functionName,
      displayName: this.addcompanyreport.value.displayName,
      params: resp,
      companyMasterID: this.addcompanyreport.value.company,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api.callApi(this.constant.UPDATECOMPANYREPORT, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/superadminmenus/company_report']);

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
  getcompany() {
    const body = {
      page: '',
      limit: '',
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETCOMPANYDATA, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allcomp = res.data;
          this.spinner.stop();
        }
      });
  }
}
