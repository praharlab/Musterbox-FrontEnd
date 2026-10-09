import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { saveAs } from 'file-saver';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-attendance-correction-reason',
    templateUrl: './list-attendance-correction-reason.component.html',
    styleUrls: ['./list-attendance-correction-reason.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListAttendanceCorrectionReasonComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: [+localStorage.getItem('company_id')],
    searchQuery: '',
  };
  limit = 10;
  page = {
    totalCount: 0,
    offset: 0,
  };
  comp: any;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  adminRoot = environment.adminRoot;
  scrollBarHorizontal = window.innerWidth < 1201;

  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  referencedata: any;

  alluser: any;
  ipAddress: any;

  body: any;
  attendanceAuthData: any;
  formValue: any;

  receivedData: any = '';
  rows = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private formValueStorageService: FormValueStorageService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/attendaceCorrectionReason/list_attendance_correction_request',
          this.adminRoot + '/attendaceCorrectionReason/list_attendance_correction_request/edit_attendance_correction_request',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListAttendanceCorrectionRequestComponent', false);
        }
      }
    });

    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.filterData = {
      page: 1,
      limit: 10,
      companyMasterID: [+localStorage.getItem('company_id')],
      searchQuery: '',
    };
    this.page = {
      totalCount: 0,
      offset: 0,
    };
    this.limit = 10;

    this.getattendancereasondata();
    this.checkpermission();
    this.getcompany();
  }

  onSubmit() {
    if (!this.datefilter.valid) return;

    this.filterData.companyMasterID = this.datefilter.value.companyMasterID;
    this.getattendancereasondata();
  }

  downloadFile() {
    this.spinner.stop('start');

    let mainbody: any = {
      companyMasterID: this.filterData.companyMasterID,
      searchQuery: this.filterData.searchQuery,
      exportData: true,
    };

    this.api
      .callApi(this.constant.LISTATTENDANCECORRECTIONREASON, mainbody, 'POST', true, false, true, true)
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
    saveAs(blob, 'AttendanceCorrectionReason.xlsx');
    this.spinner.stop('start');
  }

  clear() {
    this.datefilter.resetForm();

    // this.formValueStorageService.removeData('ListDepartmentComponent', false);
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }

  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.comp = res.data;
          this.spinner.stop('company');
        } else {
          this.handleError(res.message);
          this.spinner.stop('company');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('company');
      },
    );
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getattendancereasondata();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
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
          this.permissiondelete = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AttendanceCorrectionReason' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AttendanceCorrectionReason' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AttendanceCorrectionReason' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AttendanceCorrectionReason' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop('permission');
        }
      });
  }

  getattendancereasondata() {
    // let body = {
    //   page: this.filterData.page,
    //   limit: this.filterData.limit,
    //   companyMasterID: this.filterData.companyMasterID,
    // };

    this.spinner.start('main1');
    this.api
      .callApi(this.constant.LISTATTENDANCECORRECTIONREASON, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.page.totalCount = res.totalcount;
            this.spinner.stop('main1');
          } else {
            this.handleError(res.message);
            this.spinner.stop('main1');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('main1');
        },
      );
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/masters/attendaceCorrectionReason/add_attendance_correction_reason']);
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  onPageChanged(val: any) {
    this.filterData.page = val.page;
    this.getattendancereasondata()
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListAttendanceCorrectionReasonComponent',
      this.body,
      '/masters/attendaceCorrectionReason/edit_attendance_correction_reason',
      rowData.attendanceCorrectionReasonID,
    );

    this.router.navigate([this.adminRoot + '/masters/attendaceCorrectionReason/edit_attendance_correction_reason']);
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.getattendancereasondata();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getattendancereasondata();
    }
  }

  deleteAttendanceReason(rowData: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          attendanceCorrectionReasonID: rowData.attendanceCorrectionReasonID,
        };
        this.spinner.start('confirm');
        this.api.callApi(`${this.constant.DELETEATTENDANCEDATABYREASON}?attendanceCorrectionReasonID=${body.attendanceCorrectionReasonID}`, body, 'DELETE', true, true, true).subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.getattendancereasondata();
              // this.router.navigate([this.adminRoot + '/masters/attendaceCorrectionReason']);
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
}
