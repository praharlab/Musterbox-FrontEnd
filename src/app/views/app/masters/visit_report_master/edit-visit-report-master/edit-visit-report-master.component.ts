import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-visit-report-master',
    templateUrl: './edit-visit-report-master.component.html',
    styleUrls: ['./edit-visit-report-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditVisitReportMasterComponent implements OnInit {
  @ViewChild('editvisitreport') editvisitreport: NgForm;
  ipAddress: any;
  company: any = [];
  visitreportdata: any;
  usertype: any;
  company_id: any;
  buttonDisabled = false;
  buttonState = '';
  childcompany: string;
  adminRoot = environment.adminRoot;
  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    public activatedRoute: ActivatedRoute,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
  ) {}

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getIPAddress();
    this.getcompany();
    this.editdata();
  }
  editdata() {
    let companyid = this.formValue.ViewVisitReportMasterComponent.id;
    this.spinner.start();
    this.api
      .callApi(this.constant.VIEWVISITREPORTMASTER + companyid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.visitreportdata = res.data;
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

  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start();
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.company = res.data;
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

  onSubmit() {
    if (!this.editvisitreport.valid) {
      return;
    }
    let body;
    if (this.childcompany == 'false') {
      body = {
        visitReportMasterID: this.formValue.ViewVisitReportMasterComponent.id,
        visitReportName: this.editvisitreport.value.visitReportName,
        companyMasterID: this.editvisitreport.value.companyMasterID,
        status: '1',
        updateBy: localStorage.getItem('id'),
        updateByIp: this.ipAddress,
      };
    } else {
      body = {
        visitReportMasterID: this.formValue.ViewVisitReportMasterComponent.id,
        visitReportName: this.editvisitreport.value.visitReportName,
        companyMasterID: localStorage.getItem('company_id'),
        status: '1',
        updateBy: localStorage.getItem('id'),
        updateByIp: this.ipAddress,
      };
    }
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.spinner.start();
    this.api
      .callApi(this.constant.UPDATEVISITREPORTMASTER, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.router.navigate([this.adminRoot + '/masters/visit_report_master']);

              this.buttonDisabled = false;
              this.buttonState = '';
              this.spinner.stop();
            }, 3000);
          } else {
            this.notifications.create('Error', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.buttonDisabled = false;
            this.buttonState = '';
            this.spinner.stop();
          }
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.buttonDisabled = false;
          this.buttonState = '';
          this.spinner.stop();
        },
      );
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
}
