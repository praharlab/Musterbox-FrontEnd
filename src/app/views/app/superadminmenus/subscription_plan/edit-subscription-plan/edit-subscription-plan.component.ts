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
    selector: 'app-edit-subscription-plan',
    templateUrl: './edit-subscription-plan.component.html',
    styleUrls: ['./edit-subscription-plan.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditSubscriptionPlanComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  country: any = [];
  state: any = [];
  city: any = [];
  finalcityid: any;
  file: any;
  format: any;
  url: any;
  ipAddress: any;
  product: any = [];
  productmain: any;
  companydata: any;
  adminRoot = environment.adminRoot;
  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
  ) {}

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.getIPAddress();
    this.getproduct();
    this.editdata();
  }

  editdata() {
    let companyid = this.formValue.ListSubscriptionPlanComponent.id;
    this.spinner.start();
    this.api
      .callApi(this.constant.VIEWSUBSCRIPTIONDATA + companyid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.companydata = res.data;
          this.spinner.stop();
        },
        (err) => {
          console.log('error', err);
          this.spinner.stop();
        },
      );
  }

  getproduct() {
    const body = {
      page: '',
      limit: '',
    };
    this.api
      .callApi(this.constant.GETPRODUCTDATA, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.product = res.data;
        }
      });
  }
  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }

    let body = {
      companyPlanMasterID: this.formValue.ListSubscriptionPlanComponent.id,
      productMasterID: this.productmain,
      startDate: this.addcomp.value.startDate,
      endDate: this.addcomp.value.endDate,
      totalUser: this.addcomp.value.totalUser,
      totalTracking: this.addcomp.value.totalTracking,
      status: 1,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.UPDATECOMPANYSUBSCRIPTION, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.router.navigate([this.adminRoot + '/superadminmenus/company_subscription']);

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

  selectproduct(ev: any) {
    this.productmain = ev;
  }
}
