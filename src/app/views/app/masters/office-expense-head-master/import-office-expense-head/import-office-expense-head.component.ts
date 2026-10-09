import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AppNotificationService } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-import-office-expense-head',
    templateUrl: './import-office-expense-head.component.html',
    styleUrls: ['./import-office-expense-head.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ImportOfficeExpenseHeadComponent implements OnInit {
  @ViewChild('addimportuser') addimportuser: NgForm;
  @ViewChild('table') table: DatatableComponent;
  @ViewChild('tableForm') tableForm: NgForm;

  rows = [];
  ipAddress: any;
  selected = [];
  companyData: any;
  file: any;
  filterData = {
    companyMasterID: +localStorage.getItem('company_id'),
  };
  adminRoot = environment.adminRoot;
  remarksCount: any = 0;
  isEdited: any = true;
  isValidated: any = false;
  fileName: any = '';
  cityData: any;
  country: any = [];
  state: any = [];
  city: any = [];
  cityid: any;
  stateid: any;
  finalrows: any = [];
  category: any = [];
  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private notifications: AppNotificationService,
    private http: HttpClient,
    private router: Router,
    private commonNotificationService: CommonNotificationService
  ) { }

  ngOnInit(): void {
    this.filterData.companyMasterID = +localStorage.getItem('company_id');
    this.getcompany();
    this.getIPAddress();
  }

  getcompany() {
    const body = {
      companyMasterID: this.filterData.companyMasterID,
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.companyData = res.data;
          this.spinner.stop('company');
        } else {
          this.handleError(res.message);
          this.spinner.stop('company');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('company');
      },
    );
  }
  getcategory() {
    this.spinner.start();
    const body = {
      companyMasterID: this.addimportuser.value.company,
    };
    this.api
      .callApi(this.constant.GETALLOFFICEEXPENSECATEGORY, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.category = res.data;
          this.spinner.stop();
        }
      });
  }

  validateData() {

    if (!this.addimportuser.valid) return;
    if (this.file) {
      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('companyMasterID', this.addimportuser.value.company);

      this.spinner.start('validate');
      this.api
        .callApi(this.constant.VALIDATEOFFICEEXPENSEHEADEXCEL, formData, 'POST', true, true, true)
        .subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.getcategory();
              this.rows = res.data;
              let nextId = 0;
              this.rows = res.data.map((item: any) => ({
                ...item,
                uniqueID: nextId++, // <-- assign unique id
              }));
              this.remarksCount = this.rows.filter(
                (item: any) => item.remarks !== '' && item.remarks !== null,
              ).length;
              this.commonNotificationService.handleSuccess(res.message);
              this.isValidated = true;
              this.file = {};
              this.spinner.stop('validate');
            } else {
              this.file = {};
              this.handleError(res.message);
              this.spinner.stop('validate');
            }
          },
          (err) => {
            this.file = {};
            this.handleError(err.error.message);
            this.spinner.stop('validate');
          },
        );
    }
  }
  reValidateData() {
    if (!this.tableForm.valid) {
      return;
    }
    const dataArray = this.rows.map((item) => ({
      officeExpenseCategoryID: item.officeExpenseCategoryID,
      officeExpenseHead: item.officeExpenseHead,
    }));
    this.spinner.start('revalidate');
    let body = {
      officeExpenseHeadData: dataArray,
      companyMasterID: this.addimportuser.value.company,
    };
    this.rows = []
    this.tableForm.resetForm()
    this.api
      .callApi(this.constant.REVALIDATEOFFICEEXPENSEHEADEXCEL, body, 'POST', false, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            let nextId = 0;
            this.rows = res.data.map((item: any) => ({
              ...item,
              uniqueID: nextId++, // <-- assign unique id
            }));
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
            this.handleError(res.message);
            this.spinner.stop('revalidate');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('revalidate');
        },
      );
  }
  saveData() {
    if (!this.tableForm.valid) {
      return;
    }
    const dataArray = this.rows.map((item) => ({
      officeExpenseCategoryID: item.officeExpenseCategoryID,
      officeExpenseHead: item.officeExpenseHead,
    }));
    this.spinner.start('saveData');
    let body = {
      officeExpenseHeadData: dataArray,
      companyMasterID: this.addimportuser.value.company,
    };
    this.api
      .callApi(this.constant.ADDVALIDATEOFFICEEXPENSEHEADEXCEL, body, 'POST', false, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.commonNotificationService.handleSuccess(res.message);
            this.rows = [];
            this.fileName = '';
            this.file = {};
            this.isValidated = false;
            setTimeout(() => {
              this.ngOnInit();
              this.prev()
              this.spinner.stop('saveData');
            }, 3000);
          } else {
            this.handleError(res.message);
            this.spinner.stop('saveData');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('saveData');
        },
      );
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  onFileChange(event: any) {
    this.file = event.target.files && event.target.files[0];
    this.fileName = this.file.name;
    this.rows = [];
    this.isValidated = false;
    event.target.value = '';
  }

  private handleError(message: any) {
    this.commonNotificationService.handleError(message);
  }
  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'Demo Office Expense Head.xlsx');
    this.spinner.stop('start');
  }
  downloadDemoExcel() {
    this.spinner.start('start');

    let mainbody: any = {
      page: '',
      limit: '',
      companyMasterID: this.addimportuser.value.company,
    };

    this.api
      .callApi(
        this.constant.GENERATEDEMOEXCELFOROFFICEEXPENSEHEAD,
        mainbody,
        'POST',
        true,
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => this.handleFileDownload(res),
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
  }

  addRow() {
    const maxId = this.rows.length
      ? Math.max(...this.rows.map(row => row.uniqueID || 0))
      : 0;

    this.rows.push({
      uniqueID: maxId + 1,
      remarks: '',
      expenseHead: '',
      officeExpenseCategoryID: '',
    });

    this.isEdited = true;
  }


  removeRow(index: number) {
    const rowId = this.rows[index].uniqueID;
    this.rows.splice(index, 1);
    this.isEdited = true;

    // Remove form controls associated with the row
    const categoryControlName = `officeExpenseCategoryID${rowId}`;
    const headControlName = `officeExpenseHead${rowId}`;

    if (this.tableForm && this.tableForm.controls) {
      if (this.tableForm.controls[categoryControlName]) {
        delete this.tableForm.controls[categoryControlName];
      }
      if (this.tableForm.controls[headControlName]) {
        delete this.tableForm.controls[headControlName];
      }
    }


    // Optional: force validation state reset
    this.tableForm.form.markAsPristine();
    this.tableForm.form.markAsUntouched();
  }

  clear() {
    this.rows = [];
    this.fileName = '';
    this.file = {};
    this.spinner.start('company');
    setTimeout(() => {
      this.ngOnInit();
      this.spinner.stop('company');
    }, 3000);
    this.isValidated = false;
  }

  onExpenseHeadDataChange(event) {
    this.isEdited = true;
  }

  prev() {
    this.router.navigate([this.adminRoot + '/masters/officeExpenseHead']);
  }
  companyChange(event) {
    this.filterData.companyMasterID = this.addimportuser.value.company;
    this.rows = [];
    this.fileName = '';
    this.file = {};
    this.isValidated = false;
  }
}
