import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { NgForm, NgModel } from '@angular/forms';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { saveAs } from 'file-saver';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-team-outside-attendance',
    templateUrl: './team-outside-attendance.component.html',
    styleUrls: ['./team-outside-attendance.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TeamOutsideAttendanceComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('addcomp2') addcomp2: NgForm;
  adminRoot = environment.adminRoot;

  copersonlist: any;
  selected: any[];
  itemOptionsPerPage = ItemOptionsPerPageArray;
  permissionview: any = [];
  permissiondelete: any = [];
  permissionedit: any = [];
  permissioncreate: any = [];
  itemsPerPage = 10;


  filterData = {
    page: 1,
    limit: 10,
    startdate: '',
    enddate: '',
    userMasterID: [],
    companyMasterID: +localStorage.getItem('company_id'),
    searchQuery: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  usertype: string;
  company_id: string;
  rows: any = [];
  events: any;
  excelevents: any;

  limit = 10;
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
          this.adminRoot + '/attendances/Team-Outside-Attendance',
          this.adminRoot + '/attendances/Team-Outside-Attendance/Edit-Team-Outside-Attendance',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('TeamOutsideAttendanceComponent', false);
        }
      }
    });
  }

  ngOnInit(): void {
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.formValue = this.formValueStorageService.getData();

    if (this.formValueStorageService.isEmptyObject('TeamOutsideAttendanceComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        startdate: '',
        enddate: '',
        userMasterID: [],
        companyMasterID: +localStorage.getItem('company_id'),
        searchQuery: '',
      };
    } else {
      this.filterData = this.formValue.TeamOutsideAttendanceComponent.body;
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getReportToWithoutChild();
    this.checkpermission();
  }

  getReportToWithoutChild() {
    let id = localStorage.getItem('id');
    this.spinner.start('report');
    this.api.callApi(this.constant.REPORTTO2 + id, {}, 'GET', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.copersonlist = res.data;
          this.copersonlist = this.copersonlist.filter((e) => {
            return e.userMasterID != id;
          });

          this.selectAllForDropdownItems(this.copersonlist);
          this.copersonlist.map((el) => {
            el.name = el.employee.displayName;
          });
          let data1 = [];
          this.copersonlist.forEach(async (rating) => {
            data1.push(rating.userMasterID);
          });
          this.selected = data1;
          this.filterData.userMasterID = this.selected;
          this.getdata();
          this.spinner.stop('report');
        } else {
          this.handleError(res.message);
          this.spinner.stop('report');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('report');
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

          this.permissiondelete = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'TeamOutsideAttendancePermission' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'TeamOutsideAttendancePermission' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'TeamOutsideAttendancePermission' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'TeamOutsideAttendancePermission' &&
              permissionval.operationName.includes('Create')
            );
          });
        }
      });
  }

  getdata() {

    this.spinner.start('getdata');
    this.api
      .callApi(this.constant.GETALLDATEWISE, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.page.totalCount = res.totalcount;
            setTimeout(() => {
              this.currentPage = this.filterData.page;
              this.itemsPerPage = this.filterData.limit;

            }, 100);
            this.spinner.stop('getdata');
          } else {
            this.handleError(res.message);
            this.spinner.stop('getdata');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('getdata');
        },
      );
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.getdata();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getdata();
    }
  }

  onSubmit() {
    if (!this.addcomp2.valid) {
      return;
    }

    if (this.addcomp2.value.user.length != 0) {
      this.filterData.userMasterID = this.addcomp2.value.user;
    } else {
      this.filterData.userMasterID = this.selected;
    }

    this.filterData.startdate = this.addcomp2.value.startdate;
    this.filterData.enddate = this.addcomp2.value.enddate;

    this.getdata();
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
  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'All';
      });
    };
    allSelect(items);
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getdata();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getdata();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/attendances/Team-Outside-Attendance/Add-Team-Outside-Attendance']);
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
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: false,
                });
                this.getdata();
                this.spinner.stop('confirm');
              } else {
                this.handleError(res.message);
                this.spinner.stop('confirm');
              }
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
    this.addcomp2.resetForm();

    this.formValueStorageService.removeData('TeamOutsideAttendanceComponent', false);
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'TeamOutsideAttendanceComponent',
      this.filterData,
      '/attendances/Team-Outside-Attendance/Edit-Team-Outside-Attendance',
      rowData.datewiseAttendancepolicyID,
    );
  }

}
