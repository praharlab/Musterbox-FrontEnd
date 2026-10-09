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
import { ViewEmployeeFoodAllowancePolicyComponent } from '../view-employee-food-allowance-policy/view-employee-food-allowance-policy.component';

@Component({
    selector: 'app-employee-food-allowance-policy',
    templateUrl: './employee-food-allowance-policy.component.html',
    styleUrls: ['./employee-food-allowance-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EmployeeFoodAllowancePolicyComponent implements OnInit {
  @ViewChild('AddFoodAllowancePolicy') AddFoodAllowancePolicy: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;

  @ViewChild(ViewEmployeeFoodAllowancePolicyComponent)
  viewEmployeeFoodAllowancePolicyComponent: ViewEmployeeFoodAllowancePolicyComponent;

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
    this.company_id = localStorage.getItem('company_id');
    this.profileStatusService.refreshProfileStatus();
  }

  alldata() {
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETEMPLOYEEFOODALLOWANCEPOLICYBYUSERID +
        +localStorage.getItem('id'),
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


  getfoodAllowancePolicyDataModal(item: any) {
    this.getFoodAllowancePolicyID = item['foodAllowancePolicy.id'];
    this.viewEmployeeFoodAllowancePolicyComponent.id = item['foodAllowancePolicy.id'];
    this.viewEmployeeFoodAllowancePolicyComponent.ngOnInit();
    this.selectedFoodAllowancePolicyName = item['foodAllowancePolicy.foodAllowancePolicyName'];
  }
}
 