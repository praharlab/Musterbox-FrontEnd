import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import {  CommonFilterFields } from 'src/app/constants/CommonFilterFields';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { DownloadFileService } from 'src/app/services/download-file.service';

@Component({
    selector: 'app-professional-tax-register',
    templateUrl: './professional-tax-register.component.html',
    styleUrls: ['./professional-tax-register.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ProfessionalTaxRegisterComponent implements OnInit {
  permissionview: any = [];
  hideFilters: CommonFilterFields[] = [CommonFilterFields.Branch,
  CommonFilterFields.Department,
  CommonFilterFields.Designation,
  CommonFilterFields.Division,
  CommonFilterFields.WorkingArea,
  CommonFilterFields.User,
  CommonFilterFields.Status,
  CommonFilterFields.Project,
  CommonFilterFields.SkillCategory,
  CommonFilterFields.SalaryType,
  CommonFilterFields.EmployementType];
  Allstates: any = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private commonNotificationService: CommonNotificationService,
    private downloadFileService: DownloadFileService,
  ) {

  }

  ngOnInit() {
    this.checkpermission();
    this.getAllState();
  }

  checkpermission() {
    this.spinner.start('permission');
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          let permission = res.data;
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ProfessionalTaxRegister' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop('permission');
        }
      });
  }

  getAllState() {
    this.spinner.start('state')
    this.api
      .callApi(this.constant.GETSTATEBYCOUNTRY + 103, {}, 'GET', false, false, false)
      .subscribe(
        (res: any) => {
          this.spinner.stop('state')
          this.Allstates = res.data;
        },
        (err) => {
          this.spinner.stop('state')
          console.log('error', err);
        },
      );
  }

  downloadExcel(event:any) {

    const filterData = {
      companyMasterID: event?.company,
      stateId: event?.state,
      YYYYMM: event?.month.replace('-',''),
      exportType: 'excel'
    }

    console.log(event);


    this.spinner.start('download');
    this.api
      .callApi(this.constant.PTREGISTER, filterData, 'POST', false, false, true, true)
      .subscribe(
        (res: any) => {
          this.downloadFileService.handleFileDownload(res, `PT Register ${filterData.YYYYMM}.xlsx`, 'text/xlsx');
          this.spinner.stop('download');
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('download');
        },
      );
    

    console.log('hello excel');


  }

  downloadPdf(event:any) {

    const filterData = {
      companyMasterID: event?.company,
      stateId: event?.state,
      YYYYMM: event?.month.replace('-',''),
      exportType: 'pdf'
    }


    this.spinner.start('getdata');
    this.api
      .callApi(this.constant.PTREGISTER, filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            let base64String = res.data;
            this.downloadPdfData(base64String, `PT Register ${filterData.YYYYMM}`);
          }
          this.spinner.stop('getdata');
        },
        (err) => {
          this.spinner.stop('getdata');
        },
      );
  }


  convertBase64ToBlob(base64String: string) {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'application/pdf' });
  }

  downloadPdfData(base64String: string, fileName: string) {
    const blob = this.convertBase64ToBlob(base64String);
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(url);
  }

}
