import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as fs from 'file-saver';
import { saveAs } from 'file-saver';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { DownloadFileService } from 'src/app/services/download-file.service';
@Component({
    selector: 'app-import-designation-wise-document',
    templateUrl: './import-designation-wise-document.component.html',
    styleUrls: ['./import-designation-wise-document.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ImportDesignationWiseDocumentComponent implements OnInit {
  @ViewChild('addimportuser') addimportuser: NgForm;
  @ViewChild('table') table: DatatableComponent;
  @ViewChild('tableForm') tableForm: NgForm;
  adminRoot = environment.adminRoot;
  filterData = {
    companyMasterID: +localStorage.getItem('company_id'),
  };
  isEdited: any = true;
  isValidated: any = false;
  companyData: any;
  ipAddress: any;
  rows = [];
  file: any;
  fileName: any = '';
  isResetForm: boolean = false;
  remarksCount: any = 0;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private router: Router,
    private commonNotificationService: CommonNotificationService,
    private downloadFileService: DownloadFileService,
  ) { }

  ngOnInit(): void {
    this.filterData.companyMasterID = +localStorage.getItem('company_id');
    this.isValidated = false;
    this.isEdited = true;
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

  prev() {
    this.router.navigate([this.adminRoot + '/masters/designationWiseDocument']);
  }
  onFileChange(event: any) {
    this.file = event.target.files && event.target.files[0];
    this.fileName = this.file.name;
    this.rows = [];
    this.isValidated = false;
    event.target.value = '';
  }
  companyChange() {
    this.rows = [];
    this.fileName = '';
    this.file = {};
    this.isValidated = false;
  }

  downloadDemoExcel() {
    if (!this.addimportuser.value.company) {
      return this.commonNotificationService.handleWarning('Select Company');
    }
    this.spinner.start('start');
    let mainbody: any = {
      companyMasterID: +this.addimportuser.value.company,
    };
    this.api
      .callApi(
        this.constant.GENERATEDEMOEXCELDESIGNATIONWISEDOCUMENT,
        mainbody,
        'POST',
        true,
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          this.downloadFileService.handleFileDownload(res, 'Demo Designationwise Document.xlsx', 'text/xlsx');
          this.spinner.stop('start');

        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
  }

  onChange(type, data, i) {
    if (type == 'isRequired') {
      this.rows[i].isRequired = data.isRequired
    }
    if (type == 'add') {
      this.rows[i].isNeeded = data.isNeeded
      if (data.isNeeded == false) {
        this.rows[i].isRequired = false
      }
    }
  }

  validateData() {
    if (!this.addimportuser.valid) return;
    if (this.file) {
      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('companyMasterID', this.addimportuser.value.company);
      this.spinner.start('validate');
      this.api
        .callApi(this.constant.VALIDATEEMPLOYEEDESIGNATIONWISEDOCUMENT, formData, 'POST', true, true, true)
        .subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.rows = res.data;
              this.rows = this.rows.map((item) => ({
                ...item,
                isDeleted: false
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
              this.isValidated = true;
              this.file = {};
              this.spinner.stop('validate');
            } else {
              this.file = {};
              this.commonNotificationService.handleError(res.message);
              this.spinner.stop('validate');
            }
            this.fileName = ''
          },
          (err) => {
            this.file = {};
            this.fileName = ''
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

    this.spinner.start('revalidate');
    let body = {
      designationWiseDocData: this.rows,
    };
    this.api
      .callApi(this.constant.REVALIDATEDESIGNATIONWISEDOCUMENTDATA, body, 'POST', false, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.rows = this.rows.map((item) => ({
              ...item,
              isDeleted: false
            }));
            this.remarksCount = this.rows.filter(
              (item: any) => item.remarks !== '' && item.remarks !== null,
            ).length;
            if (this.remarksCount > 0) {
              this.isEdited = true;
            } else {
              this.isEdited = false;
            }
            this.commonNotificationService.handleSuccess(res.message)
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

    this.spinner.start('saveData');
    let body = {
      designationWiseDocData: this.rows,
      companyMasterID: +this.addimportuser.value.company,
    };
    this.api
      .callApi(this.constant.ADDVALIDATEDESIGNATIONWISEDOCUMENT, body, 'POST', false, true, true)
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
              this.spinner.stop('saveData');
            }, 3000);
          } else {
            this.fileName = '';
            this.commonNotificationService.handleError(res.message);
            this.spinner.stop('saveData');
          }
        },
        (err) => {
          this.fileName = '';
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('saveData');
        },
      );
  }


  clear() {
    this.rows = [];
    this.remarksCount = 0;
    this.fileName = '';
    this.file = {};
    this.spinner.start('company');
    setTimeout(() => {
      this.ngOnInit();
      this.spinner.stop('company');
    }, 3000);
    this.isValidated = false;
  }

  onDataChange(event) {
    this.isEdited = true;
  }
}
