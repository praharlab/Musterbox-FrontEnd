import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { environment } from 'src/environments/environment';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-attendance-verified',
    templateUrl: './attendance-verified.component.html',
    styleUrls: ['./attendance-verified.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AttendanceVerifiedComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  scrollBarHorizontal = window.innerWidth < 1201;
  limit = 10;
  page = {
    totalCount: 0,
    offset: 0,
  };
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: '',
    branch: '',
    user: [],
    yearMonth: '',
  };
  body = {
    page: 1,
    limit: 10,
    searchQuery: '',
    companyMasterID: '',
    YearMM: '',
  };
  adminRoot = environment.adminRoot;
  events: any;
  filter: any;
  childcompany: any;
  company_id: any;
  cid: any;
  company: any;
  usertype: any;
  excelevents: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  resultColumns: any = [];
  attyear: any;
  attcomp: any;
  allbranch: any;
  alluser: any;
  leavetypedata: any;
  ipAddress: any;
  isdisebled: boolean;
  unverifyArr = [];
  body1 = [];
  finaldata: boolean;
  selected: any[];
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
    this.childcompany = localStorage.getItem('childcompany');
    this.company_id = localStorage.getItem('company_id');
    this.cid = localStorage.getItem('company_id');
    this.usertype = localStorage.getItem('usertype');
    this.checkpermission();
    this.getcompany();
    this.getIPAddress();
  }

  getcompany() {
    if (this.usertype == 2) {
      const body = {
        page: '',
        limit: '',
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETCOMPANYDATA, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.company = res.data;

            this.attcomp = localStorage.getItem('attcomp');
            this.attyear = localStorage.getItem('attyear');
            this.spinner.stop();
          }
        });
    } else {
      const body = {
        companyMasterID: this.company_id,
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.company = res.data;

            this.spinner.stop();
          }
        });
    }
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
              permissionval.formName == 'AttendanceCalculation' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AttendanceCalculation' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AttendanceCalculation' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AttendanceCalculation' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  selectcompany(id) {
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {

        this.allbranch = res;

        // this.selectAllForDropdownItems(this.allbranch)
        // let data1=[];
      });

    const body = {
      page: '',
      limit: '',
      companyMasterID: id,
    };
    this.api
      .callApi(this.constant.GETALLUSERS, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alluser = res.data;
          this.selectAllForDropdownItems(this.alluser);
          let data1 = [];
          this.alluser.forEach(async (rating) => {
            data1.push(rating.userMasterID);
          });
          this.selected = data1;
          this.spinner.stop();
        }
      });
  }

  selectbranch(id) {

    const filterData = {
      branchMasterID: id,
    };
    if (id != '' && id != null) {
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.alluser = res.data;
            this.selectAllForDropdownItems(this.alluser);
            this.alluser.map((el) => {
              el.name = el.displayName;
            });

            let data1 = [];
            this.alluser.forEach(async (rating) => {
              data1.push(rating.userMasterID);
            });
            this.selected = data1;
            this.spinner.stop();
          }
        });
    } else {
      const body = {
        page: '',
        limit: '',
        companyMasterID: this.datefilter.value.cid,
      };
      this.api
        .callApi(this.constant.GETALLUSERS, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.alluser = res.data;
            this.selectAllForDropdownItems(this.alluser);
            let data1 = [];
            this.alluser.forEach(async (rating) => {
              data1.push(rating.userMasterID);
            });
            this.selected = data1;
            this.spinner.stop();
          }
        });
    }
  }

  updateFilter(event): void {
    this.rows = [];
    this.resultColumns = [];
    this.events = event;
    this.excelevents = event.target.value;
    const val = event.target.value.toLowerCase().trim();
    this.body.searchQuery = val;
    if (this.childcompany == 'true') {
      this.body.companyMasterID = this.company_id;
    } else {
      this.cid = this.datefilter.value.cid;
      this.body.companyMasterID = this.datefilter.value.cid;
    }
    this.body.YearMM = this.datefilter.value.YearMM.replace('-', '');
    if (this.body.companyMasterID == '' && this.body.YearMM == '' && this.childcompany == 'false') {
      this.notifications.create(
        'Error',
        'Please Select Company And YearMM!!',
        NotificationType.Bare,
        { theClass: 'outline primary', timeOut: 3000, showProgressBar: false },
      );
      this.spinner.stop();
    } else if (this.body.YearMM == '' && this.childcompany == 'true') {
      this.notifications.create('Error', 'Please Select YearMM!!', NotificationType.Bare, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });
      this.spinner.stop();
    } else {
      this.api
        .callApi(this.constant.GETATTENDANCEBAL, this.body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.filter = 'search';
            this.rows = res.data;
            this.temp = [...this.rows];
            this.page.totalCount = res.totalcount;
            this.resultColumns = [];
            for (var key in this.rows[0]) {
              this.resultColumns.push({
                name: key,
                prop: key,
                flexGrow: 1.2,
                minWidth: 180,
              });
            }
            this.spinner.stop();
          }
        });
    }
  }
  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }
    if (this.childcompany == 'true') {
      this.filterData.companyMasterID = this.company_id;
    } else {
      this.cid = this.datefilter.value.cid;
      this.filterData.companyMasterID = this.datefilter.value.cid;
    }

    this.filterData.yearMonth = this.datefilter.value.YearMM.replace('-', '');
    //   this.filterData.branch = this.datefilter.value.branch;
    // this.filterData.user = this.datefilter.value.user;

    if (this.datefilter.value.branch == '' || this.datefilter.value.branch == null) {
      this.filterData.branch = '';
    } else {
      this.filterData.branch = this.datefilter.value.branch;
    }

    if (this.datefilter.value.user == '' || this.datefilter.value.user == null) {
      this.filterData.user = this.selected;
    } else {
      this.filterData.user = this.datefilter.value.user;
    }
    this.api
      .callApi(this.constant.GETATTENDANCEVERIFIED, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.filter = 'filter';
          this.rows = res.data;
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          this.spinner.stop();
        }
      });
    this.finaldata = true;
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (this.filter == 'search') {
      this.body.page = e.offset + 1;
      this.updateFilter(this.events);
    } else if (this.filter == 'filter') {
      this.filterData.page = e.offset + 1;
      this.onSubmit();
    } else {
      console.log('error');
    }
  }

  onLimitChange(ev: any) {
    if (this.filter == 'search') {
      this.body.limit = ev;
      this.limit = this.body.limit;
      this.updateFilter(this.events);
    } else if (this.filter == 'filter') {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.onSubmit();
    } else {
      console.log('error');
    }
  }
  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/payrolls/attendancecal']);
  }

  alertUnVerifyAll() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to UnVerify All?',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, UnVerify it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body1 = {
          companyMasterID: this.datefilter.value.cid,
          user: this.datefilter.value.user,
          yearMonth: this.datefilter.value.YearMM.replace('-', ''),
          branchMasterID: this.datefilter.value.branch,
          updateBy: localStorage.getItem('id'),
          updateByIp: this.ipAddress,
        };

        this.spinner.start();
        this.isdisebled = true;
        this.api
          .callApi(this.constant.ATTENDANCEUNVERIFYALL, body1, 'POST', true, false, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });
                // this.ngOnInit();
                setTimeout(() => {
                  // this.router.navigate(['app/attendancecal'])
                  this.spinner.stop();
                  this.isdisebled = false;
                }, 3000);
                window.location.reload();
              } else {
                this.notifications.create('Error', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: false,
                });
                this.spinner.stop();
                this.isdisebled = false;
              }
            },
            (err) => {
              this.notifications.create('Error', err, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.spinner.stop();
              this.isdisebled = false;
            },
          );
      }
    });
  }

  alertConfirmation(row) {
    this.unverifyArr.push(row);
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to unverify?',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, unverify it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body1 = {
          userMasterID: row.userMasterID,
          yearMonth: row.yearMonth,
          updateBy: localStorage.getItem('id'),
          updateByIp: this.ipAddress,
        };


        this.spinner.start();
        this.isdisebled = true;
        this.api
          .callApi(this.constant.ATTENDANCEUNVERIFY, body1, 'POST', true, false, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });
                // this.ngOnInit();
                setTimeout(() => {
                  // this.router.navigate(['app/attendancecal'])
                  this.spinner.stop();
                  this.isdisebled = false;
                }, 3000);
                this.onSubmit();
              } else {
                this.notifications.create('Error', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: false,
                });
                this.spinner.stop();
                this.isdisebled = false;
              }
            },
            (err) => {
              this.notifications.create('Error', err, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.spinner.stop();
              this.isdisebled = false;
            },
          );
      }
    });
  }
  clear() {
    window.location.reload();
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'All';
      });
    };
    allSelect(items);
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
}
