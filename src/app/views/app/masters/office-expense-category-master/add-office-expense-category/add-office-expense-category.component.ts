import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AppNotificationService } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonFilterButtonFields, CommonFilterFields } from 'src/app/constants/CommonFilterFields';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';

@Component({
    selector: 'app-add-office-expense-category',
    templateUrl: './add-office-expense-category.component.html',
    styleUrls: ['./add-office-expense-category.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddOfficeExpenseCategoryComponent implements OnInit {

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

  filterData = {
    companyMasterID: null,
    officeExpenseCategory: ''
  }

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
              permissionval.formName == 'OfficeExpenseCategory' &&
              permissionval.operationName.includes('Create')
            );
          });

          this.spinner.stop();
        }
      });
  }

  getCompany(companyMasterID: number) {
    this.filterData.companyMasterID = companyMasterID;
  }

  onSubmit(val: any) {
    this.filterData.companyMasterID = val.company;
    this.filterData.officeExpenseCategory = val.officeExpenseCategory;

    this.spinner.start('addofficeExpenseCategory');
    this.api.callApi(this.constant.ADDOFFICEEXPENSECATEGORY, this.filterData, 'POST', false, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          setTimeout(() => {
            this.router.navigate(['/app/masters/officeExpenseCategory'])
            this.spinner.stop('addofficeExpenseCategory');
          }, 3000);
        }
        this.commonNotificationService.handleSuccess(res.message);
      },
      (err) => {
        this.spinner.stop('addofficeExpenseCategory');
        this.commonNotificationService.handleError(err.error.message);
      },
    )

  }

}
