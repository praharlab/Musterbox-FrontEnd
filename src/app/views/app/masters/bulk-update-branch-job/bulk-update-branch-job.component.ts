import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { saveAs } from 'file-saver';
import { NgForm } from '@angular/forms';
import * as xlsx from 'xlsx';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { FilterStatusService } from 'src/app/services/filter-status.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ProfileStatusService } from 'src/app/services/profile-status.service';
import { NationalityListService } from 'src/app/services/nationality-list.service';
import {
  CommonFilterButtonFields,
  CommonFilterFields,
  CommonRequiredFields,
  ItemOptionsPerPageArray,
} from 'src/app/constants/CommonFilterFields';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { attendanceFromType, updateBranchJob } from 'src/app/constants/commonVariables';
import { labelUtils } from 'src/app/constants/labelUtils';
import { DownloadFileService } from 'src/app/services/download-file.service';
import { CommonFilterModule } from '../../common-filter/common-filter.module';
import { CommonUtils } from 'src/app/utils/common.utils';
@Component({
    selector: 'app-bulk-update-branch-job',
    templateUrl: './bulk-update-branch-job.component.html',
    styleUrls: ['./bulk-update-branch-job.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class BulkUpdateBranchJobComponent implements OnInit {
  hideFilters: CommonFilterFields[] = [
    CommonFilterFields.Department,
    CommonFilterFields.Designation,
    CommonFilterFields.Division,
    CommonFilterFields.WorkingArea,
    CommonFilterFields.Project,
    CommonFilterFields.Status,
    CommonFilterFields.SkillCategory,
    CommonFilterFields.SalaryType,
    CommonFilterFields.EmployementType,
  ];
  showButtons: CommonFilterButtonFields[] = [
    CommonFilterButtonFields.Submit,
    CommonFilterButtonFields.Clear,
  ];
  showRequiredFields: CommonRequiredFields[] = [CommonRequiredFields.Company];
  updateBranchJobDropDownValues: any = updateBranchJob;
  isValidated: any = false;
  isEdited: any = true;
  fileName: any = '';
  file: any;
  validatedRows: any = [];
  uploadObject: any = null;
  remarksCount: any = 0;
  remarksSerialNumber: any = [];
  remarksNote: any = null;
  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,
    private formValueStorageService: FormValueStorageService,
    private commonNotificationService: CommonNotificationService,
    private downloadFileService: DownloadFileService,
  ) {}
  filterData = {
    companyMasterID: null,
    branchID: [],
    userMasterID: [],
    uploadTypes: [],
  };
  ngOnInit(): void {
    CommonUtils.selectAllForDropdownItems(this.updateBranchJobDropDownValues);
  }
  getCompany(companyMasterID: number) {
    this.filterData.companyMasterID = companyMasterID;
    this.onEveryChange();
  }

  validateData(val: any) {
    this.filterData.companyMasterID = val?.company;
    this.filterData.branchID = val?.branch;
    this.filterData.userMasterID = val?.user;
    this.filterData.uploadTypes = val?.uploadTypes;
    if (!this.file) {
      this.commonNotificationService.handleWarning('Please Select Any File');
    }

    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('companyMasterID', this.filterData.companyMasterID);
    if (this.filterData.branchID && this.filterData.branchID.length) {
      formData.append('branchID', JSON.stringify(this.filterData.branchID));
    }
    if (this.filterData.userMasterID && this.filterData.userMasterID.length) {
      formData.append('userMasterID', JSON.stringify(this.filterData.userMasterID));
    }
    formData.append('uploadTypes', JSON.stringify(this.filterData.uploadTypes));
    this.spinner.start('validate');
    this.api
      .callApi(this.constant.VALIDATEBRANCHJOBTITLE, formData, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.validatedRows = res.data;
            this.uploadObject = res.uploadObject;
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
  saveData() {
    if (
      !this.filterData?.companyMasterID ||
      !this.filterData?.uploadTypes ||
      this.filterData?.uploadTypes.length == 0
    )
      return;

    this.spinner.start('saveData');
    let body = {
      validatedBranchJobData: this.validatedRows,
      companyMasterID: this.filterData.companyMasterID,
      uploadTypes: this.filterData.uploadTypes,
      userMasterID: this.filterData.userMasterID,
    };
    this.api
      .callApi(this.constant.ADDVALIDATEBRANCHJOBTITLE, body, 'POST', false, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.commonNotificationService.handleSuccess(res.message);

            this.validatedRows = [];

            this.uploadObject = null;
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
  clear() {
    this.filterData = {
      companyMasterID: null,
      branchID: null,
      userMasterID: [],
      uploadTypes: [],
    };
    this.onEveryChange();
  }
  demoImportCompanyData(val: any) {
    if (!val?.company || !val?.uploadTypes || val?.uploadTypes.length == 0) return;
    this.filterData.companyMasterID = val?.company;
    this.filterData.branchID = val?.branch;
    this.filterData.userMasterID = val?.user;
    this.filterData.uploadTypes = val?.uploadTypes;
    this.spinner.start('start');

    this.api
      .callApi(this.constant.EXPORTDEMOJOBTITLE, this.filterData, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => {
          this.downloadFileService.handleFileDownload(res, 'Demo Branch/Job.xlsx', 'text/xlsx');
          this.spinner.stop('start');
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
  }
  init(val: any) {
    this.filterData.userMasterID = val.map((x) => x.userMasterID);
    this.onEveryChange();
  }

  onFileChange(event: any) {
    this.onEveryChange();
    this.file = event.target.files && event.target.files[0];
    this.fileName = this.file.name;
    this.validatedRows = [];
    this.uploadObject = null;
    this.remarksSerialNumber = [];
    this.remarksCount = 0;
    this.isValidated = false;
    event.target.value = '';
  }
  onEveryChange() {
    this.validatedRows = [];
    this.uploadObject = null;
    this.remarksSerialNumber = [];
    this.remarksCount = 0;
    this.file = '';
    this.fileName = '';
    this.isValidated = false;
  }
}
