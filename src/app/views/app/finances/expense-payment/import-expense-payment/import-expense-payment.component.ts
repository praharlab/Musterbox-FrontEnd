import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { saveAs } from 'file-saver';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import {
  CommonFilterButtonFields,
  CommonFilterFields,
  CommonRequiredFields,
} from 'src/app/constants/CommonFilterFields';
import { DownloadFileService } from 'src/app/services/download-file.service';

@Component({
    selector: 'app-import-expense-payment',
    templateUrl: './import-expense-payment.component.html',
    styleUrls: ['./import-expense-payment.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ImportExpensePaymentComponent implements OnInit {
  @ViewChild('table') table: DatatableComponent;
  @ViewChild('tableForm') tableForm: NgForm;
  adminRoot = environment.adminRoot;
  showExtraButton: boolean = false;

  hideFilters: CommonFilterFields[] = [
    CommonFilterFields.Status,
    CommonFilterFields.EmployementType,
    CommonFilterFields.SalaryType,
    CommonFilterFields.SkillCategory,
  ];
  showButtons: CommonFilterButtonFields[] = [
    CommonFilterButtonFields.Submit,
    CommonFilterButtonFields.Cancel,
  ];
  showRequiredFields: any = [CommonRequiredFields.Company];
  isfileRequired: boolean = false;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: localStorage.getItem('company_id'),
    userMasterID: [],
    fromDate: '',
    toDate: '',
  };
  validatedRows: any = [];
  remarksCount: any = 0;
  isValidated: any = false;
  fileName: any = '';
  file: any;
  isEdited: any = false;
  remarksSerialNumber: any = [];
  remarksNote: any = '';
  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private commonNotificationService: CommonNotificationService,
    private downloadFileService: DownloadFileService,
  ) {}

  ngOnInit(): void {}

  getCompany(val?: any) {
    this.filterData.companyMasterID = val;
  }
  getUser(userMasterID: any) {
    this.filterData.userMasterID = userMasterID || [];
    if (this.filterData.userMasterID.length) {
      this.showExtraButton = true;
    } else {
      this.showExtraButton = false;
    }
  }
  emitUsers(users: any) {
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
    if (this.filterData.userMasterID.length) {
      this.showExtraButton = true;
    } else {
      this.showExtraButton = false;
    }
  }
  init(users: any) {
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
    if (this.filterData.userMasterID.length) {
      this.showExtraButton = true;
    } else {
      this.showExtraButton = false;
    }
  }
  downloadDemoExcel(val: any) {
    if (!val?.toDate || !val?.fromDate || !val.company) return;
    this.filterData.companyMasterID = val?.company;
    this.filterData.userMasterID =
      val?.user && val?.user.length ? val?.user : this.filterData.userMasterID;
    this.filterData.fromDate = val?.fromDate;
    this.filterData.toDate = val?.toDate;
    if (this.filterData.fromDate > this.filterData.toDate) {
      return this.commonNotificationService.handleWarning(
        'Fromdate should be less then Or equal to todate ',
      );
    }
    this.spinner.start('start');
    this.api
      .callApi(
        this.constant.GENERATEDEMOEXCELFORIMPORT,
        this.filterData,
        'POST',
        true,
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.type == 'application/json') {
            this.commonNotificationService.handleWarning(res.message);
          } else {
            this.downloadFileService.handleFileDownload(res, 'Expense Payment.xlsx', 'text/xlsx');
          }
          this.spinner.stop('start');
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
  }
  onSubmit(val: any) {
    if (!val?.file) {
      this.commonNotificationService.handleWarning('Please Upload Excel File To Import Data');
    }
    if (!val?.file || !val?.toDate || !val?.fromDate || !val.company) return;
    this.filterData.companyMasterID = val?.company;
    this.filterData.userMasterID =
      val?.user && val?.user.length ? val?.user : this.filterData.userMasterID;
    this.filterData.fromDate = val?.fromDate;
    this.filterData.toDate = val?.toDate;
    if (this.filterData.fromDate > this.filterData.toDate) {
      return this.commonNotificationService.handleWarning(
        'Fromdate should be less then Or equal to todate ',
      );
    }
    this.validateData();
  }

  onFileChange(event: any) {
    this.file = event.target.files && event.target.files[0];
    this.fileName = this.file.name;
    this.validatedRows = [];
    this.isValidated = false;
    event.target.value = '';
  }
  onProductNameChange(event) {
    this.isEdited = true;
  }
  removeRow(index: number) {
    this.validatedRows[index].isDeleted = true;
    this.isEdited = true;
  }

  validateData() {
    this.remarksSerialNumber = [];
    this.remarksCount = 0;
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('companyMasterID', this.filterData.companyMasterID);
    formData.append('fromDate', this.filterData.fromDate);
    formData.append('toDate', this.filterData.toDate);
    this.filterData.userMasterID.forEach((e) => formData.append('userMasterID', e));
    this.spinner.start('validate');
    this.api
      .callApi(this.constant.VALIDATEEXPENSEPAYMENT, formData, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.validatedRows = res.data;
            this.remarksSerialNumber = this.validatedRows
              .map((item: any, index: number) => (item.remarks?.length ? index + 1 : -1))
              .filter((index) => index !== -1);
            this.remarksCount = this.remarksSerialNumber.length;
            if (this.remarksSerialNumber.length) {
              this.remarksNote = `Note:- Please check remarks on serial numbers: ${this.remarksSerialNumber.join(
                ', ',
              )}`;
            }
            this.commonNotificationService.handleSuccess(res.message);
            this.isValidated = true;
            this.file = {};
            this.spinner.stop('validate');
          } else {
            this.file = {};
            this.commonNotificationService.handleError(res.message);
            this.spinner.stop('validate');
          }
        },
        (err) => {
          this.file = {};
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('validate');
        },
      );
  }

  reValidateData() {
    if (!this.tableForm.valid) {
      return;
    }
    this.remarksSerialNumber = [];
    this.remarksCount = 0;
    this.spinner.start('revalidate');
    const expensePaymentData = this.validatedRows.filter((e) => !e.isDeleted);
    let body = {
      expensePaymentData,
      companyMasterID: this.filterData.companyMasterID,
      fromDate: this.filterData.fromDate,
      toDate: this.filterData.toDate,
      userMasterID: this.filterData.userMasterID,
    };
    this.api
      .callApi(this.constant.REVALIDATEEXPENSEPAYMENT, body, 'POST', false, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.validatedRows = res.data;
            this.remarksSerialNumber = this.validatedRows
              .map((item: any, index: number) => (item.remarks?.length ? index + 1 : -1))
              .filter((index) => index !== -1);
            this.remarksCount = this.remarksSerialNumber.length;
            if (this.remarksSerialNumber.length) {
              this.remarksNote = `Note:- Please check remarks on serial numbers: ${this.remarksSerialNumber.join(
                ', ',
              )}`;
            }
            this.remarksCount = this.validatedRows.filter(
              (item: any) => item.remarks.length,
            ).length;
            if (this.remarksCount > 0) {
              this.isEdited = true;
            } else {
              this.isEdited = false;
            }
            this.commonNotificationService.handleSuccess(res.message);

            this.spinner.stop('revalidate');
          } else {
            this.commonNotificationService.handleError(res.message);
            this.spinner.stop('revalidate');
          }
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('revalidate');
        },
      );
  }

  saveData() {
    if (!this.tableForm.valid) {
      return;
    }
    const expensePaymentData = this.validatedRows.filter((e) => !e.isDeleted);

    this.spinner.start('saveData');
    let body = {
      expensePaymentData,
    };
    this.api
      .callApi(this.constant.ADDVALIDATEEXPENSEPAYMENT, body, 'POST', false, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.commonNotificationService.handleSuccess(res.message);
            this.validatedRows = [];
            this.remarksSerialNumber = [];
            this.remarksCount = 0;
            this.fileName = '';
            this.file = {};
            this.isValidated = false;
            setTimeout(() => {
              this.ngOnInit();
              this.spinner.stop('saveData');
            }, 3000);
          } else {
            this.commonNotificationService.handleError(res.message);
            this.spinner.stop('saveData');
          }
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('saveData');
        },
      );
  }
}
