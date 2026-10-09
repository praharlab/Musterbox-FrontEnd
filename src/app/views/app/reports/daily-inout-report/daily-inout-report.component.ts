import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonFilterButtonFields, CommonFilterFields, CommonRequiredFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';


@Component({
    selector: 'app-daily-inout-report',
    templateUrl: './daily-inout-report.component.html',
    styleUrls: ['./daily-inout-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})

export class DailyInoutReportComponent implements OnInit {

  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  itemOptionsPerPage = ItemOptionsPerPageArray;
  scrollBarHorizontal = window.innerWidth < 1201;
  page = {
    totalCount: 0,
    offset: 0,
  };

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Clear];
  showRequiredFields: any = [CommonRequiredFields.Company]

  filterData = {
    userMasterID: null,
    startDate: '',
    endDate: '',
    companyMasterID: null,
    branchMasterID: null,
    departmentId: null,
    Export: 'pdf'
  };
  permissionview: any = [];
  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private http: HttpClient,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.checkpermission();
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
              permissionval.formName == 'DailyInOutReport' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop('permission');
        }
      });
  }

  downloadPDF(val: any) {
    this.filterData = {
      userMasterID: val?.user ? val?.user : this.filterData.userMasterID,
      startDate: val.startDate,
      endDate: val.endDate,
      companyMasterID: val.company,
      branchMasterID: val.branch,
      departmentId: val.department,
      Export: 'pdf'
    };

    this.spinner.start('pdf')
    this.api
      .callApi(
        this.constant.DAILYINOUTREPORT,
        this.filterData,
        'POST',
        true,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            let base64String = res.data;
            this.downloadPdf(base64String, 'Daily In Out Report');
          }
          this.spinner.stop('pdf');
        },
        (err) => {
          this.notifications.create(
            '',
            err.error.message || 'Someting Went Wrong!',
            NotificationType.Bare,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            },
          );
          this.spinner.stop('pdf');
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

  downloadPdf(base64String: string, fileName: string) {


    const blob = this.convertBase64ToBlob(base64String);
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  clear() {
    this.filterData = {
      userMasterID: null,
      startDate: '',
      endDate: '',
      companyMasterID: null,
      branchMasterID: null,
      departmentId: null,
      Export: 'pdf'
    };
  }

  init(users: any) {
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }

  emitUsers(users: any) {
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }
}
