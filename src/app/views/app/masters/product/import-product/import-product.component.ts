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

@Component({
    selector: 'app-import-product',
    templateUrl: './import-product.component.html',
    styleUrls: ['./import-product.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ImportProductComponent implements OnInit {
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

  validateData() {
    if (!this.addimportuser.valid) return;
    if (this.file) {
      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('companyMasterID', this.addimportuser.value.company);

      this.spinner.start('validate');
      this.api
        .callApi(this.constant.VALIDATEPRODUCTEXCEL, formData, 'POST', true, true, true)
        .subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.rows = res.data;
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
    const dataArray = this.rows.map((item) => item.productName);
    this.spinner.start('revalidate');
    let body = {
      productName: dataArray,
      companyMasterID: this.addimportuser.value.company,
    };
    this.api
      .callApi(this.constant.REVALIDATEPRODUCTDATA, body, 'POST', false, true, true)
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
    const dataArray = this.rows.map((item) => item.productName);
    this.spinner.start('saveData');
    let body = {
      productName: dataArray,
      companyMasterID: this.addimportuser.value.company,
    };
    this.api
      .callApi(this.constant.ADDVALIDATEPRODUCT, body, 'POST', false, true, true)
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
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  downloadDemoExcel() {
    let workbook = new Workbook();

    const worksheet1 = workbook.addWorksheet('Product');
    const headerRow2 = worksheet1.addRow(['Product Name']);
    headerRow2.eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF6666' },
      };
    });
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, 'Demo Product' + '.xlsx');
    });

    this.spinner.stop('demo');
  }

  addRow() {
    this.rows.push({ productName: '' });
    this.isEdited = true;
  }

  removeRow(index: number) {
    this.rows.splice(index, 1);
    this.isEdited = true;
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

  onProductNameChange(event) {
    this.isEdited = true;
  }
  prev() {
    this.router.navigate([this.adminRoot + '/masters/product']);
  }
  companyChange(event) {
    this.filterData.companyMasterID = this.addimportuser.value.company;
    this.rows = [];
    this.fileName = '';
    this.file = {};
    this.isValidated = false;
  }
}
