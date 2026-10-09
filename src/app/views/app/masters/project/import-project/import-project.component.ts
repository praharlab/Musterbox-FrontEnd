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
import { DownloadFileService } from 'src/app/services/download-file.service';

@Component({
    selector: 'app-import-project',
    templateUrl: './import-project.component.html',
    styleUrls: ['./import-project.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ImportProjectComponent implements OnInit {
  @ViewChild('addimportuser') addimportuser: NgForm;
  @ViewChild('table') table: DatatableComponent;
  @ViewChild('tableForm') tableForm: NgForm;

  rows = [];
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

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private commonNotificationService: CommonNotificationService,
    private downloadFileService: DownloadFileService,
  ) {}

  ngOnInit(): void {
    this.filterData.companyMasterID = +localStorage.getItem('company_id');
    this.getcompany();
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

  validateData() {
    this.remarksCount = 0;
    this.remarksSerialNumber = [];
    this.remarksNote = null;
    if (!this.addimportuser.valid) return;
    if (this.file) {
      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('companyMasterID', this.addimportuser.value.company);

      this.spinner.start('validate');
      this.api
        .callApi(this.constant.VALIDATEPROJECTEXCEL, formData, 'POST', true, true, true)
        .subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.rows = res.data;
              this.remarksSerialNumber = this.rows
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
  }
  remarksSerialNumber: any = [];
  remarksNote: any = null;

  reValidateData() {
    if (!this.tableForm.valid) {
      return;
    }
    const dataArray = this.rows
      .filter((item) => !item.isDeleted)
      .map((item) => ({
        projectName: item.projectName,
        projectDescription: item.projectDescription,
        short_name: item.short_name,
        display_id: item.display_id,
      }));
    this.spinner.start('revalidate');
    let body = {
      projectData: dataArray,
      companyMasterID: this.addimportuser.value.company,
    };
    this.remarksCount = 0;
    this.remarksSerialNumber = [];
    this.remarksNote = null;
    this.api
      .callApi(this.constant.REVALIDATEPROJECTDATA, body, 'POST', false, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.remarksSerialNumber = this.rows
              .map((item: any, index: number) => (item.remarks?.length ? index + 1 : -1))
              .filter((index) => index !== -1);
            this.remarksCount = this.remarksSerialNumber.length;
            if (this.remarksSerialNumber.length) {
              this.remarksNote = `Note:- Please check remarks on serial numbers: ${this.remarksSerialNumber.join(
                ', ',
              )}`;
            }
            this.isEdited = this.remarksCount > 0;
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
    const dataArray = this.rows
      .filter((item) => !item.isDeleted)
      .map((item) => ({
        projectName: item.projectName,
        projectDescription: item.projectDescription,
        short_name: item.short_name,
        display_id: item.display_id,
      }));
    this.spinner.start('saveData');
    let body = {
      projectData: dataArray,
      companyMasterID: this.addimportuser.value.company,
    };
    this.api.callApi(this.constant.ADDVALIDATEPROJECT, body, 'POST', false, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(res.message);
          this.rows = [];
          this.remarksCount = 0;
          this.remarksSerialNumber = [];
          this.remarksNote = null;
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

  onFileChange(event: any) {
    this.file = event.target.files && event.target.files[0];
    this.fileName = this.file.name;
    this.rows = [];
    this.isValidated = false;
    event.target.value = '';
  }

  downloadDemoExcel() {
    this.spinner.start('start');

    let mainbody: any = {
      page: '',
      limit: '',
    };

    this.api
      .callApi(this.constant.DEMOPROJECTEXCEL, mainbody, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => {
          this.downloadFileService.handleFileDownload(res, 'Demo Project.xlsx', 'text/xlsx');
          this.spinner.stop('start');
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
  }

  addRow() {
    this.rows.push({
      remarks: [],
      projectName: '',
      projectDescription: '',
      short_name: '',
      display_id: '',
    });
    this.isEdited = true;
  }

  removeRow(index: number) {
    this.rows.splice(index, 1);
    this.rows[index].isDeleted = true;
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

  onProjectDataChange(event) {
    this.isEdited = true;
  }
  prev() {
    this.router.navigate([this.adminRoot + '/masters/project']);
  }

  companyChange(event) {
    this.filterData.companyMasterID = this.addimportuser.value.company;
    this.rows = [];
    this.fileName = '';
    this.file = {};
    this.isValidated = false;
  }
}
