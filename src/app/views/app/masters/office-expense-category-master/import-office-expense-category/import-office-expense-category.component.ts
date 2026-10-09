import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { DownloadFileService } from 'src/app/services/download-file.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-import-office-expense-category',
    templateUrl: './import-office-expense-category.component.html',
    styleUrls: ['./import-office-expense-category.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ImportOfficeExpenseCategoryComponent implements OnInit {

  @ViewChild('importForm') importForm: NgForm;
  @ViewChild('tableForm') tableForm: NgForm;

  allCompany: any = [];

  filterData = {
    companyMasterID: null,
    officeExpenseCategory: '',
    officeExpenseCategoryID: null,
    exportData: false
  }

  formValue: any

  file: any
  rows: any = []
  remarksCount: any = 0;
  isEdited: any = true;
  isValidated: any = false;
  fileName: any = '';

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private api: ApiService,
    private constant: ConstantService,
    private commonNotificationService: CommonNotificationService,
    private downloadFileService: DownloadFileService,
  ) { }

  ngOnInit(): void {
    this.getcompany()
  }

  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.allCompany = res.data;
          this.spinner.stop('company');
        } else {
          this.commonNotificationService.handleError(res.message);
          this.spinner.stop('company');
        }
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message);
        this.spinner.stop('company');
      },
    );
  }

  cancel() {
    this.router.navigate(['/app/masters/officeExpenseCategory'])
  }

  onSelectFile(event: any) {
    this.file = event.target.files && event.target.files[0];
  }

  validateData() {
    if (!this.importForm.valid) return;
    if (this.file) {
      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('companyMasterID', this.importForm.value.company);

      this.spinner.start('validate');
      this.api
        .callApi(this.constant.VALIDATEOFFICEEXPENSECATEGORYEXCEL, formData, 'POST', true, true, true)
        .subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.rows = res.data;
              this.remarksCount = this.rows.filter(
                (item: any) => item.remarks !== '' && item.remarks !== null,
              ).length;
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
  }

  reValidateData() {
    if (!this.tableForm.valid) {
      return;
    }
    const dataArray = this.rows.map((item) => item.officeExpenseCategory);
    this.spinner.start('revalidate');
    let body = {
      officeExpenseCategory: dataArray,
      companyMasterID: this.importForm.value.company,
    };
    this.api
      .callApi(this.constant.REVALIDATEOFFICEEXPENSECATEGORYEXCEL, body, 'POST', false, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.remarksCount = this.rows.filter(
              (item: any) => item.remarks !== '' && item.remarks !== null,
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
    const dataArray = this.rows.map((item) => item.officeExpenseCategory);
    this.spinner.start('saveData');
    let body = {
      officeExpenseCategory: dataArray,
      companyMasterID: this.importForm.value.company,
    };
    this.api
      .callApi(this.constant.ADDVALIDATEDOFFICEEXPENSEVATEGORYEXCEL, body, 'POST', false, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.commonNotificationService.handleSuccess(res.message);
            this.rows = [];
            this.fileName = '';
            this.file = {};
            this.isValidated = false;
            setTimeout(() => {
              this.cancel();
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

  addRow() {
    this.rows.push({ departmentName: '' });
    this.isEdited = true;
  }

  removeRow(index: number) {
    this.rows.splice(index, 1);
    this.isEdited = true;
  }

  downloadDemoExcel() {
    this.filterData.exportData = true;
    this.spinner.start('OfficeExpenseCategories');
    this.api.callApi(this.constant.DOWNLOADDEMOEXCELFOROFFICEEXPENSECATEGORY, {}, 'GET', false, true, true, this.filterData.exportData).subscribe(
      (res: any) => {
        if (res.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          this.downloadFileService.handleFileDownload(
            res,
            'OfficeExpenseCategory.xlsx',
            'text/xlsx',
          );
          this.filterData.exportData = false;
          this.spinner.stop('OfficeExpenseCategories');
        }
        this.spinner.stop('OfficeExpenseCategories');
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message)
      },
    )
  }
}
