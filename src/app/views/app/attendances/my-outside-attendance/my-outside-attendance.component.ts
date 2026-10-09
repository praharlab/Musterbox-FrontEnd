import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-my-outside-attendance',
    templateUrl: './my-outside-attendance.component.html',
    styleUrls: ['./my-outside-attendance.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MyOutsideAttendanceComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows: any = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode;
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  @ViewChild('filterdate') datefilter: NgForm;

  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;

  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    userMasterID: localStorage.getItem('id'),
    companyMasterID: localStorage.getItem('company_id'),
    startdate: '',
    enddate: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  limit = 10;

  ipAddress: any;
  permissionview: any = [];
  CalendarStartDate: string;
  CalendarEndDate: string;

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

  ngOnInit() {

    this.filterData = {
      page: 1,
      limit: 10,
      userMasterID: localStorage.getItem('id'),
      companyMasterID: localStorage.getItem('company_id'),
      startdate: '',
      enddate: '',
    };
    this.page = {
      totalCount: 0,
      offset: 0,
    };
    this.limit = 10;


    this.getIPAddress();
    this.checkpermission();
    this.getalldata();
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
              permissionval.formName == 'MyOutsideAttendance' &&
              permissionval.operationName.includes('View')
            );
          });
        }
      });
  }

  getalldata() {
    this.spinner.start('data');
    this.api
      .callApi(this.constant.GETALLDATEWISE, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.page.totalCount = res.totalcount;
            this.spinner.stop('data');
          } else {
            this.handleError(res.message);
            this.spinner.stop('data');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('data');
        },
      );
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }

    this.filterData.startdate = this.datefilter.value.startdate;
    this.filterData.enddate = this.datefilter.value.enddate;
    this.getalldata();

  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getalldata();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getalldata();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
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
