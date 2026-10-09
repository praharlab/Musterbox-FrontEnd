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
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-audit-logs',
    templateUrl: './list-audit-logs.component.html',
    styleUrls: ['./list-audit-logs.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListAuditLogsComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  rows1 = [];
  selected: any = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  SelectionType = SelectionType;
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: '',
    startdate: '',
    enddate: '',
    tableName: '',
    operation: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  events: any;
  filter: any;
  export: any;
  excelevents: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  limit = 10;
  // usertype: any;
  company_id: any;
  alluser: any;
  company1: any;
  designation1: any;
  image: any;
  target: any;
  resultColumns: any[];
  resultColumns1: any[];
  // childcompany: string;
  // cid: string;
  selected1: any = [];
  companydata: any;
  allasset: any = [];
  selected2: any = [];
  salary: boolean;
  companymasterName: any;
  public users: Array<any> = [];
  employee: any;
  allbranch: any;
  branchfilter: boolean = false;
  employeedata: any;
  currentPage: number;

  allWorkingArea: any;
  alldesignation: any;
  alldepartment: any;
  allDivision: any;
  divisionfilter: any;
  departmentfilter: any;
  designationfilter: any;
  workingareafilter: any;
  selecteddesig: any[];
  selectedDivision: any[];
  selectedWorkingArea: any[];
  selectedDepartment: any[];
  selectedUser: any[];
  selectedBranch: any[];
  isResetForm: boolean = false;
  tables: any;
  selectedNewValue: any;
  selectedOldValue: any;
  selectedData: any;
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
    this.company_id = +localStorage.getItem('company_id');
    this.checkpermission();
    this.filterData.companyMasterID = this.company_id;
    this.getcompany();
    this.getTables();
    this.getAuditLogsData();
  }
  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.company1 = res.data;

          this.spinner.stop();
        }
      });
  }

  getTables() {
    this.spinner.start();
    this.api
      .callApi(this.constant.GETAUDITTABLENAME, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.tables = res.data;
          this.spinner.stop();
        }
      });
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
          this.permissiondelete = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AuditLog' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AuditLog' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AuditLog' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AuditLog' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }

    this.filterData.page = 1;
    this.filterData.startdate = this.datefilter.value.startdate
      ? this.datefilter.value.startdate.slice(0, 10)
      : null;
    this.filterData.enddate = this.datefilter.value.enddate
      ? this.datefilter.value.enddate.slice(0, 10)
      : null;
    this.filterData.companyMasterID = this.datefilter.value.company;
    this.filterData.tableName = this.datefilter.value.tableName;
    this.filterData.operation = this.datefilter.value.operation;
    this.getAuditLogsData();
  }

  getAuditLogsData() {
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLAUDITLOGS, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.filterData.page;
          }, 100);
          this.spinner.stop();
        }
      });
  }
  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getAuditLogsData();
    } else {
      console.log('error');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getAuditLogsData();
    } else {
      console.log('error');
    }
  }

  clear() {
    this.isResetForm = true;
    this.datefilter.resetForm();

    setTimeout(() => {
      this.rows = [];
      this.filterData = {
        page: 1,
        limit: 10,
        companyMasterID: '',
        startdate: '',
        enddate: '',
        tableName: '',
        operation: '',
      };
      this.page = {
        totalCount: 0,
        offset: 0,
      };
      this.ngOnInit();
    }, 200);
    this.isResetForm = false;
  }

  download() {
    let body1 = {
      page: '',
      limit: '',
      startdate: this.datefilter.value.startdate.slice(0, 10),
      enddate: this.datefilter.value.enddate.slice(0, 10),
      companyMasterID: this.datefilter.value.company,
      tableName: this.datefilter.value.tableName,
      operation: this.datefilter.value.operation,
      exportData: true,
    };

    this.spinner.start('start');
    this.api
      .callApi(this.constant.GETALLAUDITLOGS, body1, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => this.handleFileDownload(res),
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
  }

  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'Audit Logs.xlsx');
    this.spinner.stop('start');
  }
  private handleSuccess(message: any) {
    this.notifications.create('Done', message, NotificationType.Bare, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: true,
    });
  }
  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
  }

  showData(row) {
    this.selectedData = {
      operation: row.operation,
      tableName: row.tableName,
      createdAt: row.createdAt,
      createByUser: row.createByUser,
    };
    if (this.selectedData.tableName === 'departments') {
      this.selectedNewValue = !this.isEmptyObject(row.newValue)
        ? {
            'Department Name': row.newValue.departmentName,
            Status:
              row.newValue.status == 1
                ? 'Active'
                : row.newValue.status == 0
                ? 'Deactive'
                : 'Deleted',
          }
        : null;
      this.selectedOldValue = !this.isEmptyObject(row.oldValue)
        ? {
            'Department Name': row.oldValue.departmentName,
            Status:
              row.oldValue.status == 1
                ? 'Active'
                : row.oldValue.status == 0
                ? 'Deactive'
                : 'Deleted',
          }
        : null;
    } else if (this.selectedData.tableName === 'designations') {
      this.selectedNewValue = !this.isEmptyObject(row.newValue)
        ? {
            'Designation Name': row.newValue.designationName,
            Status:
              row.newValue.status == 1
                ? 'Active'
                : row.newValue.status == 0
                ? 'Deactive'
                : 'Deleted',
          }
        : null;
      this.selectedOldValue = !this.isEmptyObject(row.oldValue)
        ? {
            'Designation Name': row.oldValue.designationName,
            Status:
              row.oldValue.status == 1
                ? 'Active'
                : row.oldValue.status == 0
                ? 'Deactive'
                : 'Deleted',
          }
        : null;
    } else if (this.selectedData.tableName === 'divisions') {
      this.selectedNewValue = !this.isEmptyObject(row.newValue)
        ? {
            'Division Name': row.newValue.divisionName,
            Status:
              row.newValue.status == 1
                ? 'Active'
                : row.newValue.status == 0
                ? 'Deactive'
                : 'Deleted',
          }
        : null;
      this.selectedOldValue = !this.isEmptyObject(row.oldValue)
        ? {
            'Division Name': row.oldValue.divisionName,
            Status:
              row.oldValue.status == 1
                ? 'Active'
                : row.oldValue.status == 0
                ? 'Deactive'
                : 'Deleted',
          }
        : null;
    } else if (this.selectedData.tableName === 'workingAreas') {
      this.selectedNewValue = !this.isEmptyObject(row.newValue)
        ? {
            'Working Area Name': row.newValue.workingAreaName,
            Status:
              row.newValue.status == 1
                ? 'Active'
                : row.newValue.status == 0
                ? 'Deactive'
                : 'Deleted',
          }
        : null;
      this.selectedOldValue = !this.isEmptyObject(row.oldValue)
        ? {
            'Working Area Name': row.oldValue.workingAreaName,
            Status:
              row.oldValue.status == 1
                ? 'Active'
                : row.oldValue.status == 0
                ? 'Deactive'
                : 'Deleted',
          }
        : null;
    }
  }
}
