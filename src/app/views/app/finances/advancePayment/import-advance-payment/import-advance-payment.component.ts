import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
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

@Component({
    selector: 'app-import-advance-payment',
    templateUrl: './import-advance-payment.component.html',
    styleUrls: ['./import-advance-payment.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ImportAdvancePaymentComponent implements OnInit {
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
    authorizationMasterID: null,
    branchMasterID: null
  };
  adminRoot = environment.adminRoot;
  remarksCount: any = 0;
  isEdited: any = true;
  isValidated: any = false;
  fileName: any = '';
  authdata: any;
  allbranch: any = [];
  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private notifications: AppNotificationService,
    private http: HttpClient,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.filterData.companyMasterID = +localStorage.getItem('company_id');
    this.isValidated = false;
    this.isEdited = true;
    this.getcompany();
    this.getbranch(this.filterData.companyMasterID)
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

  getbranch(id) {
    this.spinner.start('branch')

    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;

        // this.page.totalCount = res.totalcount;
        this.spinner.stop('branch');
      });
  }
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  validateData() {
    if (!this.addimportuser.valid) return;
    if (this.file) {
      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('companyMasterID', this.addimportuser.value.company);
      if (this.addimportuser.value.branchMasterID) {
        formData.append('branchMasterID', this.addimportuser.value.branchMasterID);
      }
      formData.append('month', this.addimportuser.value.month.replace('-', ''));
      formData.append('createBy', localStorage.getItem('id'));
      formData.append('createByIp', this.ipAddress);

      this.spinner.start('validate');
      this.api.callApi(this.constant.VALIDATEADVANCEPAYMENT, formData, 'POST', true, true, true).subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.rows = this.rows.map((item) => ({
              ...item,
              isDeleted: false, // Add the deleted property with a default value of false
            }));


            this.remarksCount = this.rows.filter(
              (item: any) => item.remarks !== '' && item.remarks !== null,
            ).length;


            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
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
    this.rows = this.rows.filter(
      (item: any) => !item.isDeleted
    );
    this.spinner.start('revalidate');
    let body = {
      advancepaymentData: this.rows,
      companyMasterID: this.addimportuser.value.company,
      branchMasterID: this.addimportuser.value.branchMasterID ? this.addimportuser.value.branchMasterID : null,
      month: this.addimportuser.value.month.replace('-', '')
    };
    this.api
      .callApi(this.constant.REVALIDATEADVANCEPAYMENT, body, 'POST', false, true, true)
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
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
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
    this.spinner.start('saveData');
    let body = {
      advancepaymentData: this.rows,
    };
    this.api
      .callApi(this.constant.ADDVALIDATEADVANCEPAYMENT, body, 'POST', false, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.rows = [];
            this.fileName = '';
            this.file = {};
            this.isValidated = false;
            setTimeout(() => {
              this.ngOnInit();
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

  companyChange(event) {
    this.filterData.companyMasterID = this.addimportuser.value.company;
    this.filterData.branchMasterID = null;
    this.filterData.authorizationMasterID = null;
    this.rows = [];
    this.fileName = '';
    this.file = null;
    this.isValidated = false;
    this.allbranch = []
    if (!event) return;
    this.getbranch(this.filterData.companyMasterID)
  }

  prev() {
    this.router.navigate([this.adminRoot + '/finances/advancePayment']);
  }

  onFileChange(event: any) {
    this.file = event.target.files && event.target.files[0];
    this.fileName = this.file.name;
    this.rows = [];
    this.isValidated = false;
    event.target.value = '';
  }

  downloadDemoExcel() {
    if (!this.addimportuser.value.company) return;
    let queryString = `?companyMasterID=${this.addimportuser.value.company}`;
    if (this.addimportuser.value.branchMasterID) {
      queryString += `&branchMasterID=${this.addimportuser.value.branchMasterID}`;
    }
    this.spinner.start('start');

    this.api
      .callApi(this.constant.GETADVANCEDEMOEXCEL + queryString, {}, 'GET', true, false, true, true)
      .subscribe(
        (res: any) => this.handleFileDownload1(res),
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
  }
  private handleFileDownload1(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'Demo Advance Payment.xlsx');
    this.spinner.stop('start');
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

  removeRow(index: number) {
    this.rows[index].isDeleted = true;
    // this.rows.splice(index, 1);
    this.isEdited = true;

  }

  onadvanceDataChange(event) {
    this.isEdited = true;
  }
}
