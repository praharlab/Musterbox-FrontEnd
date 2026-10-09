import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { saveAs } from 'file-saver';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { HttpClient } from '@angular/common/http';
import { CommonFilterButtonFields, CommonFilterFields, CommonRequiredFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';


@Component({
    selector: 'app-employee-reportsto-report',
    templateUrl: './employee-reportsto-report.component.html',
    styleUrls: ['./employee-reportsto-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EmployeeReportstoReportComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  scrollBarHorizontal = window.innerWidth < 1201;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  permissionview: any = [];
  filterData = {
    userMasterID: null,
    companyMasterID: '',
    branchMasterID: '',
    page: 1,
    limit: 10,
    Export: ''
  };
  currentPage: number;
  page = {
    totalCount: 0,
    offset: 0,
  };
  itemsPerPage = 10;
  rows: any = [];
  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
  showRequiredFields: any = [CommonRequiredFields.Company]

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
    this.filterData = {
      userMasterID: null,
      companyMasterID: '',
      branchMasterID: '',
      page: 1,
      limit: 10,
      Export: ''
    };

    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.checkpermission();
  }

  getdata() {
    this.filterData.Export = ''
    this.spinner.start('submit');
    this.api
      .callApi(this.constant.GETEMPLOYEEREPOTSTOREPORT, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          if (this.rows.length > 0) {
            this.showButtons.push(CommonFilterButtonFields.Excel)
          } else {
            this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
          }
          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.filterData.page;
            this.itemsPerPage = this.filterData.limit;
          }, 100);
          this.spinner.stop('submit');
        } else {
          this.spinner.stop('submit');
        }
      }, (err) => {
        this.spinner.stop('submit');
      },);
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
              permissionval.formName == 'EmployeeReportsToReport' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  onSubmit(val: any) {
    this.filterData.page = 1
    this.filterData.companyMasterID = val.company
    this.filterData.userMasterID = val.user ? val.user : this.filterData.userMasterID;
    this.getdata();
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getdata();
    } else {
      console.log('error');

    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.getdata();
    } else {
      console.log('error');

    }
  }

  clear() {
    this.rows = []
    this.filterData = {
      userMasterID: null,
      companyMasterID: '',
      branchMasterID: '',
      page: 1,
      limit: 10,
      Export: ''
    };
  }

  download() {
    this.filterData.Export = 'true'
    this.spinner.start('a');
    this.api
      .callApi(
        this.constant.GETEMPLOYEEREPOTSTOREPORT,
        this.filterData,
        'POST',
        true,
        true,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.type == 'application/json') {
            this.notifications.create('No data found to export!', '', NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('a');
          } else {
            var blob = new Blob([res], { type: 'text/xlsx' });
            saveAs(blob, `Employee ReportsTo Report.xlsx`);

            this.spinner.stop('a');
          }
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
          this.spinner.stop('a');
        },
      );

  }

  init(users: any) {
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }

  emitUsers(users: any) {
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }

}
