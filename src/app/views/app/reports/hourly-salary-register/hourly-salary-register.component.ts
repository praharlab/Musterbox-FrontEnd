import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, id, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { saveAs } from 'file-saver';
import { CommonFilterButtonFields, CommonFilterFields, CommonRequiredFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-hourly-salary-register',
    templateUrl: './hourly-salary-register.component.html',
    styleUrls: ['./hourly-salary-register.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class HourlySalaryRegisterComponent implements OnInit {
  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.SUBMIT_EXPORT, CommonFilterButtonFields.Clear];
  showRequiredFields: any = [CommonRequiredFields.Company]
  page = {
    totalCount: 0,
    offset: 0,
  };

  itemOptionsPerPage = ItemOptionsPerPageArray;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: '',
    fromdate: '',
    todate: '',
    userMasterID: null,
  };
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
  ) { }

  ngOnInit() {
    this.checkpermission();
  }

  checkpermission() {
    this.spinner.start();
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
              permissionval.formName == 'HourlySalaryRegister' &&
              permissionval.operationName.includes('View')
            );
          });

          this.spinner.stop();
        }
      });
  }

  download(val?: any) {
    const body = {
      yearmonth: val?.fromyearmonth.replace('-', ''),
      userMasterID: val?.user ? val.user : this.filterData.userMasterID,
      companyMasterID: val?.company,
      branchMasterID: val?.branch,
      divisionId: val?.division,
      exportData: true,
    };

    this.spinner.start('start');
    this.api
      .callApi(this.constant.HourlySalaryRegister, body, 'POST', true, false, true)
      .subscribe(
        (res: any) => this.handleFileDownload(res),
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
  }

  private handleFileDownload(res: any) {
    const blob = this.base64ToBlob(res.data);
    saveAs(blob, 'Hourly Salary Report.xlsx');
    this.spinner.stop('start');
  }

  public base64ToBlob(b64Data: string): Blob {
    const byteCharacters = atob(b64Data); // Decode Base64
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }


  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  init(users: any){
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }

  emitUsers(users: any){
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }

}
