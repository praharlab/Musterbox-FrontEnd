import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { NgForm } from '@angular/forms';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { CommonFilterButtonFields, CommonFilterFields, CommonRequiredFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
import { CommonNotificationService } from 'src/app/services/common-notification.service';

@Component({
    selector: 'app-employee-attendance-list',
    templateUrl: './employee-attendance-list.component.html',
    styleUrls: ['./employee-attendance-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EmployeeAttendanceListComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;

  ColumnMode = ColumnMode.force;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  SelectionType = SelectionType;

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
  showRequiredFields: any = [CommonRequiredFields.Company]
  formValue: any;
  commonFilterData: any
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: localStorage.getItem('company_id'),
    branchMasterID: '',
    departmentID: '',
    designationID: '',
    divisionId: '',
    workingAreaId: '',
    userMasterID: null,
    attendanceStatus: true,
    exportData: ''
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  permissionview: any = [];
  image: any;
  currentPage: any
  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private formValueStorageService: FormValueStorageService,
    private commonNotificationService: CommonNotificationService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/attendances/employee-attendance-list',
          this.adminRoot + '/attendances/employee-attendance-calendar',
          this.adminRoot + '/attendances/single-employee-attendance-list',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('commonFilterData', true);
          formValueStorageService.removeData('EmployeeAttendanceListComponent', false);
        }
      }
    });
  }

  ngOnInit() {
    this.filterData = {
      page: 1,
      limit: 10,
      companyMasterID: localStorage.getItem('company_id'),
      branchMasterID: '',
      departmentID: '',
      designationID: '',
      divisionId: '',
      workingAreaId: '',
      userMasterID: null,
      attendanceStatus: true,
      exportData: ''
    };
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.checkpermission();
  }

  onActivate(event) {
    if (event.type == 'click') {
      if (event.cellIndex == 0) {
        if (this.commonFilterData && this.commonFilterData != null && Object.keys(this.commonFilterData).length > 0)
          this.formValueStorageService.addData(
            'commonFilterData',
            this.commonFilterData
          );
        this.formValueStorageService.navigate(
          'EmployeeAttendanceListComponent',
          {
            page: this.filterData.page,
            limit: this.filterData.limit,
            companyid: +event.row.companyMasterId,
            userid: +event.row.userMasterID,
          },
          '/attendances/employee-attendance-calendar',
          event.row.userMasterID,
        );
      }
      if (event.cellIndex == 1) {
        localStorage.setItem('filterCompany', event.row.companyMasterId);
        localStorage.setItem('filterUser', event.row.userMasterID);
        this.formValueStorageService.addData(
            'commonFilterData',
            this.commonFilterData
          );
        this.formValueStorageService.navigate(
          'EmployeeAttendanceListComponent',
          {
            page: this.filterData.page,
            limit: this.filterData.limit,
            companyid: +event.row.companyMasterId,
            userid: +event.row.userMasterID,
          },
          '/attendances/single-employee-attendance-list',
          event.row.userMasterID,
        );
      }
    }
  }

  getAllData() {
    this.spinner.start('start');
    this.api
      .callApi(this.constant.GETALLUSERS, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            if (this.rows.length > 0) {
              this.showButtons.push(CommonFilterButtonFields.Excel);
            } else {
              this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
            }
            this.page.totalCount = res.totalcount;
            this.currentPage = this.filterData.page
            this.spinner.stop('start');
          } else {
            this.commonNotificationService.handleError(res.message);
            this.spinner.stop('start');
          }
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
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
              permissionval.formName == 'DailyAttendance' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  onSubmit(val: any) {
    this.filterData.page = 1;
    this.commonFilterData = val
    this.filterData.companyMasterID = val.company;
    this.filterData.branchMasterID = val.branch;
    this.filterData.departmentID = val.department;
    this.filterData.designationID = val.designation;
    this.filterData.workingAreaId = val.workingArea;
    this.filterData.divisionId = val.division;
    this.filterData.userMasterID = val.user ? val.user : this.filterData.userMasterID;
    this.filterData.exportData = ''

    this.getAllData();
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getAllData();
    } else {
      this.commonNotificationService.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.getAllData();
    } else {
      this.commonNotificationService.handleError('Something Went Wrong!');
    }
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'All';
      });
    };
    allSelect(items);
  }

  editimage(image) {
    this.image = image.facePhoto;
  }

  downloadFile() {

    this.filterData.exportData = 'true'

    this.spinner.start('a');
    this.api
      .callApi(this.constant.GETALLUSERS, this.filterData, 'POST', true, false, true, true)
      .subscribe((res: any) => {
        if (res.type == 'application/json') {
          this.commonNotificationService.handleError('No data found to export!');
          this.spinner.stop('a');
        } else {
          var blob = new Blob([res], { type: 'text/xlsx' });
          saveAs(blob, `Employee List.xlsx`);
          this.spinner.stop('a');
        }
      });
  }

  clear() {
    this.formValue = this.formValueStorageService.getData();
    this.rows = []
    this.commonFilterData = null;
    this.filterData = {
      page: this.formValue.EmployeeAttendanceListComponent?.body?.page ? this.formValue.EmployeeAttendanceListComponent?.body?.page : 1,
      limit: this.formValue.EmployeeAttendanceListComponent?.body?.limit ? this.formValue.EmployeeAttendanceListComponent?.body?.limit : 10,
      companyMasterID: localStorage.getItem('company_id'),
      branchMasterID: '',
      departmentID: '',
      designationID: '',
      divisionId: '',
      workingAreaId: '',
      userMasterID: null,
      attendanceStatus: true,
      exportData: ''
    };
    this.formValueStorageService.removeData('EmployeeAttendanceListComponent', true);
  }

  getCompany(companyMasterID: any){
    this.filterData.companyMasterID = companyMasterID;
    this.getAllData()
  }

  emitUsers(users: any){
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }
}
