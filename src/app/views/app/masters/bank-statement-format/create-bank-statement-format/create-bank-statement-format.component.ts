import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonFilterButtonFields, CommonFilterFields } from 'src/app/constants/CommonFilterFields';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';

@Component({
    selector: 'app-create-bank-statement-format',
    templateUrl: './create-bank-statement-format.component.html',
    styleUrls: ['./create-bank-statement-format.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class CreateBankStatementFormatComponent implements OnInit {

  hideFilters: CommonFilterFields[] = [
    CommonFilterFields.Status,
    CommonFilterFields.Branch,
    CommonFilterFields.Department,
    CommonFilterFields.Designation,
    CommonFilterFields.Division,
    CommonFilterFields.EmployementType,
    CommonFilterFields.Project,
    CommonFilterFields.SalaryType,
    CommonFilterFields.SkillCategory,
    CommonFilterFields.User,
    CommonFilterFields.WorkingArea
  ];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear, CommonFilterButtonFields.Cancel];
  permissionview: any = []
  selectedFieldsList: string[] = [
    'Employee Code',
    'Employee Name',
    'Name As Per Bank',
    'Contact No',
    'Department',
    'Designation',
    'Bank Name',
    'IFSC code',
    'Account Number',
    'Gross Salary',
    'Net Salary',
  ];

  selectedFields: any[] = [];
  bankMasterID: any

  filterData = {
    bankMasterID: null,
    companyMasterID: null,
    fields: []
  }
  bankdata: any

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private commonNotificationService: CommonNotificationService,
  ) { }

  ngOnInit(): void {
    this.checkpermission()
  }

  checkpermission() {
    this.spinner.start();
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          let permission = res.data;
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'BankStatementFormat' &&
              permissionval.operationName.includes('Create')
            );
          });

          this.spinner.stop();
        }
      });
  }

  getBankData() {
    this.spinner.start('bankData');
    let filter = { page: '', limit: '' };
    this.api.callApi(this.constant.GETBANKDATA, filter, 'POST', false, true, true).subscribe(
      (res: any) => {
        this.bankdata = res.data;
        this.spinner.stop('bankData');
      },
      (err) => {
        this.spinner.stop('bankData');
        this.commonNotificationService.handleError(err.error.message)
      },
    );
  }

  getCompany(companyMasterID: number) {
    this.filterData.companyMasterID = companyMasterID;
    this.getBankData();
  }

  onSubmit(val: any) {
    this.filterData.companyMasterID = val.company;
    this.filterData.bankMasterID = val.bankMasterID;
    this.filterData.fields = val.fields;

    this.spinner.start('addformat');
    this.api.callApi(this.constant.ADDBANKSTATEMENTFORMAT, this.filterData, 'POST', false, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          setTimeout(() => {
            this.router.navigate(['/app/masters/bankStatementFormat'])
          }, 3000);
        }
        this.commonNotificationService.handleSuccess(res.message);
        this.spinner.stop('addformat');
      },
      (err) => {
        this.spinner.stop('addformat');
        this.commonNotificationService.handleError(err.error.message);
      },
    )

  }

  clear() {
    setTimeout(() => {
      this.filterData = {
        bankMasterID: null,
        companyMasterID: null,
        fields: []
      }
    });
  }

  onChangeBank(item) {
    this.filterData.bankMasterID = item;
  }
}
