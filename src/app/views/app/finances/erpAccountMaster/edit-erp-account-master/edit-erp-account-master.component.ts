import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-edit-erp-account-master',
    templateUrl: './edit-erp-account-master.component.html',
    styleUrls: ['./edit-erp-account-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditErpAccountMasterComponent implements OnInit {
  @ViewChild('editerpaccountmaster') editerpaccountmaster: NgForm;
  @ViewChild('addcomp1') addcomp1: NgForm;
  ipAddress: any;
  company: any = [];
  usertype: any;
  company_id: any;
  buttonDisabled = false;
  buttonState = '';
  childcompany: string;
  category: any;
  user: any;
  salary: boolean;
  erpaccountmaster: any;
  erpdata1: any;
  adminRoot = environment.adminRoot;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getIPAddress();
    this.companyid();
    this.editdata();
    this.erpdata();
  }

  erpdata() {
    const filterData = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.api
      .callApi(this.constant.GETERP, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.erpdata1 = res.data;
          this.spinner.stop();
        }
      });
  }

  editdata() {
    let companyid = this.activatedRoute.snapshot.params.id;
    this.spinner.start();
    this.api
      .callApi(this.constant.VIEWERPACCOUNTDATA + companyid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.erpaccountmaster = res.data;
          this.spinner.stop();
        },
        (err) => {
          console.log('error', err);
          this.spinner.stop();
        },
      );
  }

  onSubmit() {
    if (!this.editerpaccountmaster.valid) {
      return;
    }

    let body;

    body = {
      erpAcountMasterID: this.activatedRoute.snapshot.params.id,
      userMasterID: this.editerpaccountmaster.value.userMasterID,
      erpAcountID: this.editerpaccountmaster.value.erpAcountID,
      status: '1',
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
    };
    this.spinner.start();
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.api.callApi(this.constant.UPDATEERPMASTERDATA, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/finances/erpAccountMaster']);
            this.buttonDisabled = false;
            this.buttonState = '';
            this.spinner.stop();
          }, 3000);
        } else {
          this.buttonDisabled = false;
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
        this.buttonDisabled = false;
        this.notifications.create('Error', err, NotificationType.Bare, {
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
  companyid() {
    const filterData = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.api
      .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.user = res.data;
          this.user.map((el) => {
            el.name = el.firstName + ' ' + el.lastName + ' (' + el.userNumber + ')';
          });
          this.spinner.stop();
        }
      });
  }
}
