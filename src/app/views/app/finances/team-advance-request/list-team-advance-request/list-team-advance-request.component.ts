import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { CommonUtils } from 'src/app/utils/common.utils';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
@Component({
    selector: 'app-list-team-advance-request',
    templateUrl: './list-team-advance-request.component.html',
    styleUrls: ['./list-team-advance-request.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListTeamAdvanceRequestComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  adminRoot = environment.adminRoot;
  rows = [];
  temp = [];
  itemsPerPage = 10;
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    userMasterID: localStorage.getItem('id'),
    searchQuery: '',
    startdate: '',
    enddate: '',
    AdvanceStatus: null,
  };
  limit = 10;
  page = {
    totalCount: 0,
    offset: 0,
  };
  events: any;
  excelevents: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  rows1: any = [];
  dialog: any;
  empId: any;

  copersonlist: any;
  copersonuserIDs: any = [];

  loginUserMasterID: any;
  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private commonNotificationService: CommonNotificationService,
    private formValueStorageService: FormValueStorageService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.filterData = {
      page: 1,
      limit: 10,
      userMasterID: localStorage.getItem('id'),
      searchQuery: '',
      startdate: '',
      enddate: '',
      AdvanceStatus: null,
    };
    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getReportToWithoutChild();
    this.checkpermission();
    this.loginUserMasterID = +localStorage.getItem('id');
  }

  getAdvancePaymentData() {
    this.spinner.start('main');
    this.api
      .callApi(this.constant.GETADVANCEBYREPORTEEUSER, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.temp = [...this.rows];
            this.page.totalCount = res.totalcount;
            this.spinner.stop('main');
          } else {
            this.commonNotificationService.handleError(res.message);
            this.spinner.stop('main');
          }
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('main');
        },
      );
  }
  onEmployeeChange(id) {
    this.empId = id;
  }
  onStatusChange(id) {
    this.filterData.startdate = '';
    this.filterData.enddate = '';
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
              permissionval.formName == 'TeamAdvanceRequest' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'TeamAdvanceRequest' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'TeamAdvanceRequest' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'TeamAdvanceRequest' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/finances/teamAdvanceRequest/addTeamAdvanceRequest']);
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.getAdvancePaymentData();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getAdvancePaymentData();
    }
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }

    if (this.datefilter.value.startdate > this.datefilter.value.enddate) {
      return this.commonNotificationService.handleError("From Date can't be greater than To Date");
    }

    this.filterData.startdate = this.datefilter.value.startdate;
    this.filterData.enddate = this.datefilter.value.enddate;
    this.filterData.userMasterID = +this.datefilter.value.empid
      ? [+this.datefilter.value.empid]
      : this.copersonuserIDs;
    this.filterData.AdvanceStatus = this.datefilter.value.AdvanceStatus
      ? this.datefilter.value.AdvanceStatus
      : null;

    this.getAdvancePaymentData();
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getAdvancePaymentData();
    } else {
      this.commonNotificationService.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getAdvancePaymentData();
    } else {
      this.commonNotificationService.handleError('Something Went Wrong!');
    }
  }

  clear() {
    this.datefilter.resetForm();
    this.filterData = {
      page: 1,
      limit: 10,
      userMasterID: localStorage.getItem('id'),
      searchQuery: '',
      startdate: '',
      enddate: '',
      AdvanceStatus: null,
    };
    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };
    this.rows = [];
    this.getReportToWithoutChild();
  }

  getReportToWithoutChild() {
    let id = +localStorage.getItem('id');
    this.spinner.start();
    this.api.callApi(this.constant.REPORTTO2 + id, {}, 'GET', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.copersonlist = res.data;
          this.copersonuserIDs = this.copersonlist.map((e) => +e.userMasterID);
          CommonUtils.selectAllForDropdownItems(this.copersonlist);
          this.filterData.userMasterID = this.copersonuserIDs;
          this.getAdvancePaymentData();
        } else {
          this.commonNotificationService.handleError(res.message);
          this.spinner.stop();
        }
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message);
        this.spinner.stop();
      },
    );
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListTeamAdvanceRequestComponent',
      this.filterData,
      '/finances/teamAdvanceRequest/editTeamAdvanceRequest',
      rowData.advancePaymentID,
    );
  }
  alertConfirmation(id: any) {
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
          .callApi(this.constant.DELETEADVANCE + '/' + id, {}, 'GET', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.commonNotificationService.handleSuccess(res.message);

                this.getAdvancePaymentData();
                this.spinner.stop('confirm');
              } else {
                this.commonNotificationService.handleError(res.message);
                this.spinner.stop('confirm');
              }
            },
            (err) => {
              this.commonNotificationService.handleError(err.error.message);
              this.spinner.stop('confirm');
            },
          );
      }
    });
  }
}
