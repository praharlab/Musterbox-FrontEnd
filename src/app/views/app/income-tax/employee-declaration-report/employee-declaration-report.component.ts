import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, id, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { saveAs } from 'file-saver';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { CommonFilterButtonFields, CommonFilterFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-employee-declaration-report',
    templateUrl: './employee-declaration-report.component.html',
    styleUrls: ['./employee-declaration-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EmployeeDeclarationReportComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode.force;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    userID: '',
    companyMasterID: '',
    branchMasterID: '',
    departmentID: '',
    designationID: '',
    assessmentYear: '',
    authStatus: '',
    Export: ''
  };
  page = {
    totalCount: 0,
    offset: 0,
  };

  permissionview: any = [];

  currentPage: number;

  financialYears: any = [];

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,

  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.checkpermission();

    this.getFinancialYears();

    this.filterData = {
      page: 1,
      limit: 10,
      userID: '',
      companyMasterID: '',
      branchMasterID: '',
      departmentID: '',
      designationID: '',
      assessmentYear: '',
      authStatus: '',
      Export: ''
    };
  }

  getFinancialYears() {

    this.spinner.start('financialyear');
    this.api.callApi(this.constant.GETFINANCIALYEARS, {}, 'GET', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.financialYears = res.data
        }
        this.spinner.stop('financialyear');
      },
      (err) => {

        this.spinner.stop('financialyear');
      },
    );

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
              permissionval.formName == 'EmployeeDeclarationReport' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop('permission');
        }
      });
  }

  onSubmit(val: any) {
    this.filterData.page = 1;
    this.filterData.userID = val?.user;
    this.filterData.companyMasterID = val?.company;
    this.filterData.branchMasterID = val?.branch;
    this.filterData.departmentID = val?.department;
    this.filterData.designationID = val?.designation;
    this.filterData.authStatus = val?.authStatus;
    this.filterData.assessmentYear = val?.financialYear;

    this.getEmployeeDeclarationData();
  }

  getEmployeeDeclarationData() {
    this.filterData.Export = ''
    this.spinner.start('getdata');
    this.api
      .callApi(this.constant.EMPLOYEEDECLARATIONREPORT, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          if (this.rows.length > 0) {
            this.showButtons.push(CommonFilterButtonFields.Excel);
          } else {
            this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
          }
          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.filterData.page;
          }, 100);
        }
        this.spinner.stop('getdata');
      }, (err) => {
        this.spinner.stop('getdata');
      });
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getEmployeeDeclarationData();
    } else {
      console.log('error');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.getEmployeeDeclarationData();
    } else {
      console.log('error');
    }
  }

  clear() {
    this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
    this.rows = [];
    this.filterData = {
      page: 1,
      limit: 10,
      userID: '',
      companyMasterID: '',
      branchMasterID: '',
      departmentID: '',
      designationID: '',
      assessmentYear: '',
      authStatus: '',
      Export: ''
    };
    this.page = {
      totalCount: 0,
      offset: 0,
    };
  }

  download() {

    this.filterData.Export = 'true'

    this.spinner.start('start');
    this.api
      .callApi(this.constant.EMPLOYEEDECLARATIONREPORT, this.filterData, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => this.handleFileDownload(res),
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('start');
          this.filterData.Export = 'false';
        },
      );
  }

  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'Employee Declaration Report.xlsx');
    this.filterData.Export = 'false';
    this.spinner.stop('start');
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  getCompany(companyMasterID: string) {
    this.filterData.companyMasterID = companyMasterID;
  }
}
