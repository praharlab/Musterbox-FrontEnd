import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonFilterButtonFields, CommonFilterFields } from 'src/app/constants/CommonFilterFields';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-bank-statement-format',
    templateUrl: './edit-bank-statement-format.component.html',
    styleUrls: ['./edit-bank-statement-format.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditBankStatementFormatComponent implements OnInit {

  permissionview: any = []

  @ViewChild('editForm') editForm: NgForm;

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

  bankStatementFormat: any = []

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
  formValue: any

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private commonNotificationService: CommonNotificationService,
    private formValueStorageService: FormValueStorageService,
  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.filterData.companyMasterID = this.formValue?.BankStatementFormatComponent?.body?.companyMasterID;
    this.filterData.bankMasterID = this.formValue?.BankStatementFormatComponent?.body?.bankMasterID;
    this.getAllData();
  }

  onSubmit() {
    this.filterData.fields = this.editForm.value.fields
    if(!this.filterData.companyMasterID || !this.filterData.bankMasterID){
      this.commonNotificationService.handleError("Something went wrong!");
      return
    }

    this.spinner.start('addformat');
    this.api.callApi(this.constant.UPDATEBANKSTATEMENTFORMAT, this.filterData, 'PUT', false, true, true).subscribe(
      (res: any) => {
        this.commonNotificationService.handleSuccess(res.message);
        if (res.status == 200) {
          setTimeout(() => {
            this.router.navigate(['/app/masters/bankStatementFormat'])
          }, 3000);
        }
        this.spinner.stop('addformat');
      },
      (err) => {
        this.spinner.stop('addformat');
        this.commonNotificationService.handleError(err.error.message);
      },
    )
  }

  getAllData() {
    this.spinner.start('update');
    this.api.callApi(this.constant.GETBANKSTATEMENTFORMAT, this.filterData, 'POST', false, true, true).subscribe(
      (res: any) => {
        this.bankStatementFormat = res.data;
        this.selectedFields = this.bankStatementFormat[0]?.fields;
        this.spinner.stop('update');
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message)
        this.spinner.stop('update');
      },
    )
  }

  cancel(){
    this.router.navigate(['/app/masters/bankStatementFormat'])
  }

}
