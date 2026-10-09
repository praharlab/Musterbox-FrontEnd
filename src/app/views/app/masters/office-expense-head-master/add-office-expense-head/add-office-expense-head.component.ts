import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonFilterButtonFields, CommonFilterFields } from 'src/app/constants/CommonFilterFields';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-add-office-expense-head',
    templateUrl: './add-office-expense-head.component.html',
    styleUrls: ['./add-office-expense-head.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddOfficeExpenseHeadComponent implements OnInit {

  expenseCategories: any = []
  filterData = {
    companyMasterID: null,
    officeExpenseHead: '',
    officeExpenseCategoryID: null
  }

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
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Cancel];
  permissioncreate: any = []

  selectedFields: any[] = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private api: ApiService,
    private constant: ConstantService,
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
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'OfficeExpenseHead' &&
              permissionval.operationName.includes('Create')
            );
          });

          this.spinner.stop();
        }
      });
  }

  getCompany(companyMasterID: number) {
    this.filterData.companyMasterID = companyMasterID;
    this.getAllCategories()

  }

  onSubmit(val: any) {
    this.filterData.officeExpenseCategoryID = val.officeExpenseCategoryID;
    this.filterData.officeExpenseHead = val.officeExpenseHead;

    const body = {
      officeExpenseHead: this.filterData.officeExpenseHead,
      officeExpenseCategoryID: this.filterData.officeExpenseCategoryID
    }
    this.spinner.start('addofficeExpenseHead');
    this.api.callApi(this.constant.ADDOFFICEEXPENSEHEAD, body, 'POST', false, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          setTimeout(() => {
            this.router.navigate(['/app/masters/officeExpenseHead'])
            this.spinner.stop('addofficeExpenseHead');
          }, 3000);
          this.commonNotificationService.handleSuccess(res.message);
        } else {
          this.commonNotificationService.handleWarning(res.message);
        }
      },
      (err) => {
        this.spinner.stop('addofficeExpenseHead');
        this.commonNotificationService.handleError(err.error.message);
      },
    )

  }

  getAllCategories() {
    let body = {
      companyMasterID: this.filterData.companyMasterID
    }
    this.spinner.stop('OfficeExpenseCategories');
    this.api.callApi(this.constant.GETALLOFFICEEXPENSECATEGORY, body, 'POST', false, true, true).subscribe(
      (res: any) => {
        this.expenseCategories = res.data;
        this.spinner.stop('OfficeExpenseCategories');
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message)
      },
    )
  }

}
