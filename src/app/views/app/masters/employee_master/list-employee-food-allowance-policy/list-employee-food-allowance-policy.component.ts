import { Component, ViewChild, OnInit, ElementRef, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProfileStatusService } from 'src/app/services/profile-status.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ViewFoodAllowancePolicyComponent } from './view-food-allowance-policy/view-food-allowance-policy.component';

@Component({
    selector: 'app-list-employee-food-allowance-policy',
    templateUrl: './list-employee-food-allowance-policy.component.html',
    styleUrls: ['./list-employee-food-allowance-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListEmployeeFoodAllowancePolicyComponent implements OnInit {
  @ViewChild('AddFoodAllowancePolicy') AddFoodAllowancePolicy: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;

  @ViewChild(ViewFoodAllowancePolicyComponent)
  viewFoodAllowancePolicyComponent: ViewFoodAllowancePolicyComponent;

  rows: any = [];
  apiURL = environment.apiUrl;

  company_id: any;
  activesalarydate: any;
  userData: any;
  getFoodAllowancePolicyID: any;
  selectedFoodAllowancePolicyName: string;
  formValue: any;
  allFoodAllowancePolicy: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,
    private profileStatusService: ProfileStatusService,
    private formValueStorageService: FormValueStorageService,
  ) {
  }
  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.alldata();
    this.getFoodAllowancePolicyData();
    this.company_id = localStorage.getItem('company_id');
    this.profileStatusService.refreshProfileStatus();
  }

  getFoodAllowancePolicyData() {
    let userid = this.formValue.ListEmployeeMasterComponent.id;
    this.spinner.start();
    this.api
      .callApi(this.constant.VIEWCOMPANYCONTACTDATA + userid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.spinner.stop();
          this.userData = res.data;

          this.spinner.start('leavepolicy');
          this.api
            .callApi(
              this.constant.GETFOODALLOWANCEPOLICYBYCOMPANYID + this.userData.companyMasterId,
              {},
              'GET',
              true,
              false,
              true,
            )
            .subscribe((res: any) => {
              if (res.status == 200) {
                this.allFoodAllowancePolicy = res.data;
              }
              this.spinner.stop('leavepolicy');
            });
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

  alldata() {
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETEMPLOYEEFOODALLOWANCEPOLICYBYUSERID +
          this.formValue.ListEmployeeMasterComponent.id,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.spinner.stop();
        }
      });
  }

  onSubmit() {
    if (!this.AddFoodAllowancePolicy.valid) {
      return;
    }
    let body = {
      userMasterID: [this.formValue.ListEmployeeMasterComponent.id],
      foodAllowancePolicyId: this.AddFoodAllowancePolicy.value.foodAllowancePolicyId,
      startDate: this.AddFoodAllowancePolicy.value.startDate,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.BULKADDEMPLOYEEFOODALLOWANCEPOLICY, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.closeModal.nativeElement.click();
            this.AddFoodAllowancePolicy.resetForm();
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.alldata();
              this.closeModal.nativeElement.click();
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

  getfoodAllowancePolicyDataModal(item: any) {
    this.getFoodAllowancePolicyID = item['foodAllowancePolicy.id'];
    this.viewFoodAllowancePolicyComponent.id = item['foodAllowancePolicy.id'];
    this.viewFoodAllowancePolicyComponent.ngOnInit();
    this.selectedFoodAllowancePolicyName = item['foodAllowancePolicy.foodAllowancePolicyName'];
  }
}
 