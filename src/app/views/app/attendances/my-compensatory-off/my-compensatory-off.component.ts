import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-my-compensatory-off',
    templateUrl: './my-compensatory-off.component.html',
    styleUrls: ['./my-compensatory-off.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MyCompensatoryOffComponent implements OnInit {
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild('addcoff') addcoff: NgForm;
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
    pageSize: 10,
  };
  body = {
    userMasterID: [+localStorage.getItem('id')],
    fromdate: '',
    searchQuery: '',
    todate: '',
    page: 1,
    limit: 10,
    companyMasterID: localStorage.getItem('company_id'),
    authorizationStatus: []
  };

  page = {
    totalCount: 0,
    offset: 0,
  };

  pageSize = 10;
  company_id: any;
  comp: any;
  users: any;
  show: any = 'true';
  visible: boolean = false;
  selected3: any = [];
  attendanceTrans: any;
  ipAddress: any;
  finalbranch: string;
  selected: any[];
  finalholidaypolicy: string;
  allbranch: any[];
  ownerList: any[];
  alldepartment: any[];
  allcomp: any;
  permissionview: any = [];
  filter: any;
  statusValue: any = [];
  currentPage: number;
  currentDate: string;
  referencedata: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private http: HttpClient,
    private notifications: AppNotificationService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.body = {
      userMasterID: [+localStorage.getItem('id')],
      fromdate: '',
      searchQuery: '',
      todate: '',
      page: 1,
      limit: 10,
      companyMasterID: localStorage.getItem('company_id'),
      authorizationStatus: []
    };

    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getAllCoffData();
    // this.getcompany();
    this.getIPAddress();
    this.checkpermission();
  }

  getAllCoffData() {
    this.spinner.start('start');

    this.api
      .callApi(this.constant.GETALLCOFF, this.body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.page.totalCount = res.totalcount;
          this.visible = true;
          setTimeout(() => {
            this.currentPage = this.body.page;
            this.itemsPerPage = this.body.limit;
          }, 100);
        }
        this.spinner.stop('start');
      }, (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('start');
      },);

  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }

    this.body.page = 1;
    this.body.fromdate = this.datefilter.value.fromdate;
    this.body.todate = this.datefilter.value.todate;
    this.body.authorizationStatus = this.datefilter.value.authorizationStatus ? this.datefilter.value.authorizationStatus == 'Approved' ? [3] : this.datefilter.value.authorizationStatus == 'Reject' ? [4] : [0, 1, 2] : [];

    this.getAllCoffData();
  }

  onChange(e: any) {
    this.body.page = e.offset + 1;
    this.getAllCoffData();

  }
  onselectStartDate(e: any) {
    this.body.todate = new Date().toISOString().slice(0, 10);
  }

  onpageSizeChange(ev: any) {
    this.body.limit = ev;
    this.getAllCoffData();
  }
  updateFilter(event): void {
    const val = event.target.value.toLowerCase().trim();

    let temp = {
      searchQuery: val,
      userid: this.selected3,
      page: this.body.page,
      pageSize: this.body.limit,
    };

    this.body.searchQuery = val;

    this.visible = false;

    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOFF, this.body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.page.totalCount = res.totalcount;
          this.spinner.stop();
        }
      });

    this.visible = true;
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  showdata(row) {
    let coffMasterID = row.coffMasterID;
    this.api
      .callApi(
        this.constant.GETCOMPENSATORYOFFDATABYREFERENCEID + coffMasterID,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.referencedata = res.data;
          this.spinner.stop();
        }
      });
  }

  clear() {
    //this.visible=true
    this.datefilter.resetForm();
    setTimeout(() => {
      this.ngOnInit();
    }, 200);

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
              permissionval.formName == 'MyCompensatoryOff' &&
              permissionval.operationName.includes('View')
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
}
