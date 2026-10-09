import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonFilterButtonFields, CommonFilterFields } from 'src/app/constants/CommonFilterFields';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { CommonUtils } from 'src/app/utils/common.utils';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-add-employee-bonus',
    templateUrl: './add-employee-bonus.component.html',
    styleUrls: ['./add-employee-bonus.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddEmployeeBonusComponent implements OnInit {

  hideFilters: CommonFilterFields[] = [
    CommonFilterFields.Status,
    CommonFilterFields.Department,
    CommonFilterFields.Designation,
    CommonFilterFields.Division,
    CommonFilterFields.EmployementType,
    CommonFilterFields.WorkingArea,
    CommonFilterFields.Project,
    CommonFilterFields.SalaryType,
    CommonFilterFields.SkillCategory,

  ];
  showButtons: CommonFilterButtonFields[] = [
    CommonFilterButtonFields.Submit,
    CommonFilterButtonFields.Cancel,
  ];
  companyMasterID: any;
  selectedMonth: any;
  bonusAmount: any;
  adminRoot = environment.adminRoot;
  selectedUserId: any;
  employeeBonusData: any = [];
  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private commonNotificationService: CommonNotificationService,

  ) { }

  ngOnInit(): void {
  }

  getEmployeeBonus() {
    this.employeeBonusData = [];

    console.log(this.selectedUserId, this.selectedMonth, '---------');


    if (!this.selectedUserId || !this.selectedMonth) return;

    const body = {
      userMasterID: this.selectedUserId,
      month: this.selectedMonth.replace('-', '')
    }

    this.spinner.start('main');
    this.api
      .callApi(this.constant.GETEMPLOYEEBONUSBYUSERID, body, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.employeeBonusData = res.data;
            this.employeeBonusData = this.employeeBonusData.map((item) => ({
              ...item,
              formattedBonusYYYYMM: CommonUtils.getFormattedMonth(item.bonusYYYYMM),
              formattedPayYYYYMM: item.payYYYYMM ? CommonUtils.getFormattedMonth(item.payYYYYMM) : '',
            }));

            this.spinner.stop('main');
          } else {
            this.spinner.stop('main');
            this.commonNotificationService.handleError(res.message);
          }
        },
        (err) => {
          this.spinner.stop('main');
          this.commonNotificationService.handleError(err.error.message);
        },
      );
  }


  getCompany(val: any) {
    this.companyMasterID = val;
    this.getEmployeeBonus()
  }

  onSubmit(val: any) {
    const body = {
      userMasterID: val.user,
      bonusYYYYMM: this.selectedMonth.replace('-', ''),
      amount: this.bonusAmount
    }


    this.spinner.start('submit');
    this.api
      .callApi(this.constant.ADDEMPLOYEEBONUS, body, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(res.message);
          setTimeout(() => {
            this.router
              .navigate([this.adminRoot + '/payrolls/employee_bonus'])
              .then(() => { });
          }, 3000);
          this.spinner.stop('submit');
        } else {
          this.commonNotificationService.handleError(res.message);
          this.spinner.stop('submit');
        }
      }, (err) => {
        this.spinner.stop('submit');
      });
  }

  checkValue(event: any) {
    if (event && event.target.value <= 0) {
      this.commonNotificationService.handleError('Bonus amount should be a positive value.')
    }
  }

  getUser(userMasterID: any) {
    this.selectedUserId = userMasterID;
    this.getEmployeeBonus();

  }

}
