import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { saveAs } from 'file-saver';
import { CommonFilterButtonFields, CommonFilterFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-datewise-attendance-policy',
    templateUrl: './list-datewise-attendance-policy.component.html',
    styleUrls: ['./list-datewise-attendance-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListDatewiseAttendancePolicyComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  apiURL = environment.apiUrl;
  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
  isSubmitted: boolean = false;

  itemOptionsPerPage = ItemOptionsPerPageArray;
  commonFilterData: any

  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    startdate: '',
    enddate: '',
    userMasterID: null,
    companyMasterID: +localStorage.getItem('company_id'),
    searchQuery: '',
    branchMasterID: '',
    departmentID: '',
    designationID: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };

  permissionedit: any = [];
  permissioncreate: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  adminRoot = environment.adminRoot;

  currentPage: number;
  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private formValueStorageService: FormValueStorageService,
    private notifications: AppNotificationService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/payrolls/datewiseAttendancePolicy',
          this.adminRoot + '/payrolls/datewiseAttendancePolicy/edit_datewiseAttendancePolicy',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListDatewiseAttendancePolicyComponent', false);
          formValueStorageService.removeData('commonFilterData', true);
        }
      }
    });
  }

  ngOnInit() {
    this.page = {
      totalCount: 0,
      offset: 0,
    };
    this.checkpermission()
  }

  getAllDateWise() {
    this.spinner.start('oninit2');
    this.api
      .callApi(this.constant.GETALLDATEWISE, this.filterData, 'POST', true, false, true)
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
            setTimeout(() => {
              this.currentPage = this.filterData.page;
            }, 100);
            this.spinner.stop('oninit2');
          } else {
            this.handleError(res.message);
            this.spinner.stop('oninit2');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('oninit2');
        },
      );
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.getAllDateWise();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getAllDateWise();
    }
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getAllDateWise();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.getAllDateWise();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  changeshowfields() {
    this.ngOnInit();
  }

  onSubmit(val?: any) {
    this.filterData.page = 1;
    this.commonFilterData = val
    this.filterData.companyMasterID = val?.company;
    this.filterData.userMasterID = val?.user;
    this.filterData.startdate = val?.startdate;
    this.filterData.enddate = val?.enddate;
    this.isSubmitted = true;

    this.getAllDateWise();
  }

  downloadFile() {
    this.spinner.stop('start');

    let mainbody: any = {
      companyMasterID: this.filterData.companyMasterID,
      userMasterID: this.filterData.userMasterID,
      startdate: this.filterData.startdate,
      enddate: this.filterData.enddate,
      exportData: true
    };

    this.api
      .callApi(this.constant.GETALLDATEWISE, mainbody, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => this.handleFileDownload(res),
        (err) => {
          this.handleError(err);
          this.spinner.stop('start');
        },
      );
  }
  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'Outside Attendance.xlsx');
    this.spinner.stop('start');
  }
  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/payrolls/datewiseAttendancePolicy/add_datewiseAttendancePolicy']);
  }

  alertConfirmation(id1: any) {
    let body2 = {
      id: id1,
    };
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.start('confirm');
        this.api
          .callApi(this.constant.DELETEDATEEWISEATTENDANCEPOLICY, body2, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.getAllDateWise();
              this.spinner.stop('confirm');
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop('confirm');
            },
          );
      }
    });
  }

  clear() {
    this.formValue = this.formValueStorageService.getData();
    this.commonFilterData = null
    this.filterData = {
      page: this.formValue.ListDatewiseAttendancePolicyComponent?.body?.page ? this.formValue.ListDatewiseAttendancePolicyComponent?.body?.page : 1,
      limit: this.formValue.ListDatewiseAttendancePolicyComponent?.body?.limit ? this.formValue.ListDatewiseAttendancePolicyComponent?.body?.limit : 10,
      startdate: '',
      enddate: '',
      userMasterID: null,
      companyMasterID: null,
      searchQuery: '',
      branchMasterID: '',
      departmentID: '',
      designationID: '',
    };
    this.rows = []
    this.formValueStorageService.removeData('ListDatewiseAttendancePolicyComponent', false);
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
              permissionval.formName == 'OutsideAttendancePermission' && permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'OutsideAttendancePermission' && permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'OutsideAttendancePermission' && permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'OutsideAttendancePermission' && permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  navigateToEditPage(rowData: any): void {
    if (this.commonFilterData && this.commonFilterData != null && Object.keys(this.commonFilterData).length > 0)
      this.formValueStorageService.addData(
        'commonFilterData',
        this.commonFilterData
      );

    this.formValueStorageService.navigate(
      'ListDatewiseAttendancePolicyComponent',
      this.filterData,
      '/payrolls/datewiseAttendancePolicy/edit_datewiseAttendancePolicy',
      rowData.datewiseAttendancepolicyID,
    );
  }

  getCompany(companyMasterID: any) {
    this.filterData.companyMasterID = companyMasterID;
    this.getAllDateWise();
  }
}
