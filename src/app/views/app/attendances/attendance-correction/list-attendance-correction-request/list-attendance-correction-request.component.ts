import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { HttpClient } from '@angular/common/http';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-attendance-correction-request',
    templateUrl: './list-attendance-correction-request.component.html',
    styleUrls: ['./list-attendance-correction-request.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListAttendanceCorrectionRequestComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('accept') accept: NgForm;
  // @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild('datefilter') datefilter: NgForm;

  adminRoot = environment.adminRoot;

  rows = [];
  rows1 = [];
  apiURL = environment.apiUrl;
  columns = [];
  ColumnMode = ColumnMode;
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = [];
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    startdate: '',
    enddate: '',
    userMasterID: +localStorage.getItem('id'),
    attendanceCorrectionReasonID: null
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  limit = 10;

  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  referencedata: any;

  alluser: any;
  ipAddress: any;

  usertype: any;
  body: any;
  attendanceAuthData: any;
  formValue: any;

  showRemark: boolean = true;
  reasons: any;
  counter = 0;

  receivedData: any = '';
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
          this.adminRoot + '/attendances/list_attendance_correction_request',
          this.adminRoot + '/attendances/list_attendance_correction_request/edit_attendance_correction_request',
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

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();

    this.filterData = {
      page: 1,
      limit: 10,
      startdate: '',
      enddate: '',
      userMasterID: +localStorage.getItem('id'),
      attendanceCorrectionReasonID: null
    };
    this.page = {
      totalCount: 0,
      offset: 0,
    };
    this.limit = 10;

    this.getattendancerequestdata();
    this.checkpermission();
    this.getIPAddress();
    this.usertype = localStorage.getItem('usertype');
    this.getAttendanceCorrectionReasons();
  }

  getAttendanceCorrectionReasons() {
    let body = {
      companyMasterID: localStorage.getItem('company_id'),
    };

    this.spinner.start('getshift');
    this.api
      .callApi(this.constant.LISTATTENDANCECORRECTIONREASON, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.reasons = res.data;
          this.spinner.stop('getshift');
        }
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
              permissionval.formName == 'AttendanceCorrectionRequest' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AttendanceCorrectionRequest' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AttendanceCorrectionRequest' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AttendanceCorrectionRequest' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop('permission');
        }
      });
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/attendances/list_attendance_correction_request/add_attendance_correction_request']);
  }

  getattendancerequestdata() {


    let body = {
      page: this.filterData.page,
      limit: this.filterData.limit,
      startDate: this.filterData.startdate,
      endDate: this.filterData.enddate,
      userMasterID: this.filterData.userMasterID,
      attendanceCorrectionReasonID: this.filterData.attendanceCorrectionReasonID
    }

    this.spinner.start('main1');
    this.api
      .callApi(this.constant.LISTATTENDANCECORRECTIONREQUEST, body, 'POST', true, false, true)
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

  showdata(row) {
    this.authData(row);

    this.spinner.start('get')

    this.api
      .callApi(
        this.constant.GETATTENDANCECORRECTIONBYID + row.attendanceCorrectionRequestId,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.referencedata = res.data;
            this.spinner.stop('get');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('main1');
        },
      );
  }

  authData(row) {
    this.spinner.start('submit1')
    this.api
      .callApi(
        this.constant.GETATTENDANCEDATABYREQUESTID + row.attendanceCorrectionRequestId,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.attendanceAuthData = res.data;
            this.spinner.stop('submit1');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('submit1');
        },
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
        const body = {};
        this.spinner.start('delete');
        this.api
          .callApi(
            this.constant.DELETEATTENDANCECORRECTIONREQUEST + id,
            {},
            'DELETE',
            true,
            true,
            true,
          )
          .subscribe(
            (res: any) => {
              this.getattendancerequestdata();
              this.notifications.create('Done', res.message, NotificationType.Success, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.spinner.stop('delete');
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop('delete');
            },
          );
      }
    });
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getattendancerequestdata();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getattendancerequestdata();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };
    allSelect(items);
  }

  onSubmit1() {
    if (!this.datefilter.valid) {
      return;
    }
    this.filterData.startdate = this.datefilter.value.startdate;
    this.filterData.enddate = this.datefilter.value.enddate;
    this.filterData.attendanceCorrectionReasonID = +this.datefilter.value.attendanceCorrectionReasonID;
    this.getattendancerequestdata();
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  clear() {
    this.datefilter.resetForm();
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }

  convertTo12HourFormat(time24: string): string {
    if (!time24) return '';
    let [hours, minutes] = time24.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
  }

  isEditable(row: any): boolean {
    return (
      this.permissionedit.length !== 0 &&
      (row.authorizationStatus === 0 ||
        row.authorizationStatus === 1 ||
        row.authorizationStatus === 2) &&
      row.attendanceCorrectionAuthorizations.every((auth) => auth.authStatus === 2)
    );
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListAttendanceCorrectionRequestComponent',
      this.body,
      '/attendances/list_attendance_correction_request/edit_attendance_correction_request',
      rowData.attendanceCorrectionRequestId,
    );
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

}
