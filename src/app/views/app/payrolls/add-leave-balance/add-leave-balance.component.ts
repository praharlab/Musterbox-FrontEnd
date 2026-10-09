import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';

import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-add-leave-balance',
    templateUrl: './add-leave-balance.component.html',
    styleUrls: ['./add-leave-balance.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddLeaveBalanceComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
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
    companyMasterID: localStorage.getItem('company_id'),
    leaveid: '',
    YearMM: '',
    createBy: '',
    createByIp: '',
    searchQuery: '',
  };
  body = {
    page: 1,
    limit: 10,
    searchQuery: '',
    id: localStorage.getItem('company_id'),
  };
  body1 = {
    page: 1,
    limit: 10,
    companyid: '',
    userid: [],
  };
  body2 = {
    page: '',
    limit: '',
    companyid: '',
    userid: [],
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  events: any;
  filter: any;

  excelevents: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  limit = 10;
  usertype: any;
  company_id: any;
  alldepartment: any;
  company1: any;
  image: any;
  enddate: Date;
  export: any;
  employeedata: any;
  deptfilter: boolean = false;
  employee: any;
  selected3: any[];
  selected4: any[];
  selected: any[];
  finalbranch: string;
  allbranch: any;
  visible: boolean = false;
  excel: any;
  leaveTypes: any;
  selectedleavetype: string;
  ipAddress: any;
  Today: any;
  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private notifications: AppNotificationService,
    private router: Router,
    private http: HttpClient,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.Today = new Date().toISOString().slice(0, 10);
    this.checkpermission();
    this.getcompany();
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
              permissionval.formName == 'AddMonthlyLeaveBalance' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AddMonthlyLeaveBalance' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  updateFilter(event: any) {
    if (!this.datefilter.valid) {
      return;
    }

    this.events = event;
    this.excelevents = event.target.value;
    const val = event.target.value.toLowerCase().trim();
    this.filterData.searchQuery = val;

    this.spinner.start('getLeave');
    this.api
      .callApi(this.constant.ADDLEAVEBALANCE, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.filter = 'filter';
          this.rows = res.data;
          this.visible = true;
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          this.spinner.stop('getLeave');
        } else {
          this.spinner.stop('getLeave');
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          setTimeout(() => {}, 3000);
        }
      });
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }
    this.filterData.companyMasterID = this.datefilter.value.company;
    this.filterData.leaveid = this.datefilter.value.leavetype;
    this.filterData.YearMM = this.datefilter.value.YearMM.replace('-', '');
    this.filterData.createBy = localStorage.getItem('id');
    this.filterData.createByIp = this.ipAddress;

    this.spinner.start('getLeave');
    this.api
      .callApi(this.constant.ADDLEAVEBALANCE, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.filter = 'submit';
          this.rows = res.data;
          this.visible = true;
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          this.spinner.stop('getLeave');
        } else {
          this.spinner.stop('getLeave');
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          setTimeout(() => {}, 3000);
        }
      });
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (this.filter == 'submit') {
      this.filterData.page = e.offset + 1;
      this.onSubmit();
    } else if (this.filter == 'filter') {
      this.filterData.page = e.offset + 1;
      this.updateFilter(this.events);
    } else {
      console.log('error');
    }
  }

  onLimitChange(ev: any) {
    if (this.filter == 'submit') {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.onSubmit();
    } else if (this.filter == 'filter') {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.updateFilter(this.events);
    } else {
      console.log('error');
    }
  }

  selectcompany(id) {
    this.leaveTypes = [];
    this.selectedleavetype = '';
    this.rows = [];
    this.visible = false;
    if (id) {
      let body = {
        page: '',
        limit: '',
        companyMasterID: id,
      };

      this.spinner.start('leavetypes');
      this.api
        .callApi(this.constant.GETLEAVETYPEBYCOMPANY, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.leaveTypes = res.data;
            let temp = [];
            temp = this.leaveTypes;
            this.leaveTypes = [];
            for (var i = 0; i < temp.length; i++) {
              if (
                temp[i].LeaveID != 1 &&
                temp[i].LeaveID != 5 &&
                temp[i].LeaveID != 6 &&
                temp[i].LeaveID != 7 &&
                temp[i].LeaveID != 9 &&
                temp[i].LeaveID != 18 &&
                temp[i].status == 1 &&
                temp[i].companyMasterID == id
              ) {
                this.leaveTypes.push(temp[i]);
              }
            }
            this.spinner.stop('leavetypes');
          }
        });
    }
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  Clear() {
    this.datefilter.resetForm();
    this.rows = [];
    this.filterData = {
      page: 1,
      limit: 10,
      companyMasterID: localStorage.getItem('company_id'),
      leaveid: '',
      YearMM: '',
      createBy: '',
      createByIp: '',
      searchQuery: '',
    };
    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }
}
