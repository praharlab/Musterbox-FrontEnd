import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { saveAs } from 'file-saver';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-employee-tracking',
    templateUrl: './employee-tracking.component.html',
    styleUrls: ['./employee-tracking.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EmployeeTrackingComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  @ViewChild('editemptracking') editemptracking: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('lgModal') lgModal: any;
  @ViewChild('lgModal1') lgModal1: any;
  @ViewChild('datefilter') datefilter: NgForm;

  rows: any = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;

  columns = [
    { name: 'Id', prop: 'companyTypeID' },
    { name: 'Company Name', prop: 'companyTypename' },
    { name: 'Status', prop: 'status' },
  ];
  ColumnMode = ColumnMode;
  temp = [];
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  file: any;
  format: any;
  url: any;
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = [];
  SelectionType = SelectionType;
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: [+localStorage.getItem('company_id')],
    searchQuery: ''
  };
  // body = {
  //   page: 1,
  //   limit: 10,
  //   searchQuery: '',
  //   id: localStorage.getItem('company_id'),
  // };
  page = {
    totalCount: 0,
    offset: 0,
  };
  ipAddress: any;
  rows1: any = [];
  alldata1: any;
  checkdata: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  comp: any;
  selected_company: any = [];
  buttonDisabled = false;
  buttonState = '';
  filter: string;
  events: any;
  excelevents: any;
  limit: number;
  emptrackingdata: any;
  userTrackingID: string;
  employee: any;
  alldata: any;
  trackingid: any;
  employeeName: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit(): void {
    this.getcompany();
    // this.alldata();
    this.filter = 'main';
    this.add();
    this.getIPAddress();
    this.alltrackingdata();
    this.checkpermission();
    this.getuser();
  }

  getuser() {
    const body = {
      page: '',
      limit: '',
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLUSERS, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldata = res.data;
          this.spinner.stop();
        }
      });
  }

  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.comp = res.data;

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
              permissionval.formName == 'TrackingEmployee' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'TrackingEmployee' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'TrackingEmployee' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'TrackingEmployee' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  editdata() {
    // let userTrackingID = this.activatedRoute.snapshot.params.id;
    this.spinner.start();
    this.api
      .callApi(this.constant.EDITEMPTRACKING + '/' + this.trackingid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.emptrackingdata = res.data;
          this.employeeName = (this.emptrackingdata && this.emptrackingdata.user) ? (this.emptrackingdata.user.displayName + ' - ' + this.emptrackingdata.user.userNumber) : ''

          this.lgModal1.show();
          this.spinner.stop();
        },
        (err) => {
          console.log('error', err);
        },
      );
  }

  alltrackingdata() {
    this.spinner.start();
    this.api
      .callApi(this.constant.GETTRACKINGDATA, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          this.spinner.stop();
        }
      });
  }

  updateFilter(event): void {
    if (event.target) {
      const val = event.target.value.toLowerCase().trim();
      this.events = val;
      this.filterData.searchQuery = this.events
    } else {
      this.filterData.searchQuery = this.events
    }
    this.filter = 'search';
    this.alltrackingdata();

  }

  selectedCompany(selected_id) {
    this.selected_company = selected_id;
    const filterData = {
      page: '',
      limit: '',
      companyMasterID: selected_id,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldata1 = res.data;
          this.spinner.stop();
        }
      });
  }

  add() {
    const filterData = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETCHECKTRACKING, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.checkdata = res.data;
          this.spinner.stop();
        }
      });
  }

  showAddNewModal() {
    if (this.checkdata && !this.checkdata.exceed) {
      this.lgModal.show();
    } else if (this.checkdata && this.checkdata.exceed) {
      Swal.fire({
        title: 'Your limit exceed.',
        html: ' Please upgrade your subscription plan...<br>For upgrade plan <span style="color:blue">contact us.<span>',
        icon: 'error',
      });
    } else {
      Swal.fire({
        title: 'Something went Wrong!',
        html: 'Please try after sometime..',
        icon: 'error',
      });
    }
  }
  openEditModal(trackingUser: any) {
    this.emptrackingdata = { ...trackingUser };
    this.trackingid = trackingUser.userTrackingID;
    this.editdata();
  }

  onSubmit3() {
    if (!this.datefilter.valid) {
      return;
    }
    this.filterData.companyMasterID = this.datefilter.value.companyMasterID
    this.filter = 'filter'
    this.alltrackingdata();
  }

  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }
    let body = {
      userMasterID: this.addcomp.value.userMasterID,
      trackingTime: this.addcomp.value.trackingTime,
      companyMasterID: this.addcomp.value.companyMasterID,
      statusMonitoring: +this.addcomp.value.statusMonitoring,
      notifyReportTo: +this.addcomp.value.notifyToreportTo,
      trackStatus: 1,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.spinner.start();
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.api
      .callApi(this.constant.CREATEEMPLOYEETRACKING, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.spinner.stop();
              this.router.navigate([this.adminRoot + '/masters/employee_tracking']).then(() => {
                window.location.reload();
                this.spinner.stop();
              });
            }, 3000);
          } else {
            this.notifications.create('Error', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.buttonDisabled = false;
            this.buttonState = '';
            this.spinner.stop();
          }
        },
        (err) => {
          this.notifications.create('Error', err, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.buttonDisabled = false;
          this.buttonState = '';
          this.spinner.stop();
        },
      );
  }

  onSubmit1() {
    if (!this.editemptracking.valid) {
      return;
    }
    let body = {
      userTrackingID: this.trackingid,
      userMasterID: this.emptrackingdata.userMasterID,
      trackingTime: this.editemptracking.value.trackingTime,
      companyMasterID: this.editemptracking.value.companyMasterID,
      statusMonitoring: +this.editemptracking.value.statusMonitoring,
      notifyReportTo: +this.editemptracking.value.notifyToreportTo,
      trackStatus: 1,
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.UPDATEDEMPTRACKINGDATA, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.spinner.stop();
              this.router
                .navigate([this.adminRoot + '/masters/employee_tracking'])

                //  this.lgModal1.hide()
                .then(() => {
                  window.location.reload();
                  this.spinner.stop();
                });
            }, 3000);
          } else {
            this.notifications.create('Error', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop();
          }
        },
        (err) => {
          this.notifications.create('Error', err, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
        },
      );
  }

  onChange(e: any) {
    this.filterData.page = e.offset + 1;
    if (this.filter == 'main') {
      this.ngOnInit();
    } else if (this.filter == 'search') {
      this.updateFilter(this.events);
    } else if (this.filter == 'filter') {
      this.onSubmit3();
    } else {
      console.log('error');
    }
  }

  onLimitChange(ev: any) {
    this.filterData.limit = ev;
    if (this.filter == 'main') {
      this.ngOnInit();
    } else if (this.filter == 'search') {
      this.updateFilter(this.events);
    } else if (this.filter == 'filter') {
      this.onSubmit3();
    } else {
      console.log('error');
    }
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  disable(trackid: any) {
    const filterData = {
      userTrackingID: trackid,
      trackStatus: 0,
    };
    this.spinner.start();
    this.api.callApi(this.constant.TRACKDISABLE, filterData, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          if (this.filter == 'main') {
            this.ngOnInit();
          } else if (this.filter == 'search') {
            this.updateFilter(this.events);
          } else if (this.filter == 'filter') {
            this.onSubmit3();
          } else {
            console.log('error');
          }
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        }
      },
      (err) => {
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop();
      },
    );
  }

  //Export Csv
  downloadFile() {
    this.spinner.stop('start');

    let mainbody: any = {
      page: '',
      limit: '',
      companyMasterID: this.filterData.companyMasterID,
      searchQuery: this.filterData.searchQuery,
      exportData: true,
    };

    this.api
      .callApi(this.constant.GETTRACKINGDATA, mainbody, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => this.handleFileDownload(res),
        (err) => {
          this.handleError('Something Went Wrong!');
        },
      );
  }

  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'TrackingEmployee.xlsx');
    this.spinner.stop('main');
  }

  private handleError(err: string) {
    this.notifications.create('Error', err, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
    this.spinner.stop('main');
  }
  clear() {
    window.location.reload();
  }
}
