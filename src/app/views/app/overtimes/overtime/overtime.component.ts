import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { HttpClient } from '@angular/common/http';
import { Form, NgForm } from '@angular/forms';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-overtime',
    templateUrl: './overtime.component.html',
    styleUrls: ['./overtime.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class OvertimeComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows: any = [];
  apiURL = environment.apiUrl;
  columns = [
    { name: 'Company Name', prop: 'companyName' },
    { name: 'Company City', prop: 'subCompanyRequired' },
    { name: 'Company Email', prop: 'companyEmail' },
    { name: 'Status', prop: 'status' },
  ];
  ColumnMode = ColumnMode;
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  @ViewChild('filterdate') datefilter: NgForm;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = [];
  SelectionType = SelectionType;
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    userMasterID: localStorage.getItem('id'),
    startdate: '',
    enddate: '',
  };

  page = {
    totalCount: 0,
    offset: 0,
  };
  usertype: any;
  company_id: any;
  rows1: any = [];
  file: any;
  format: any;
  url: any;
  ipAddress: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  authdata: any;
  overtimeData: any;
  auth_creteria: any;
  limit = 10;

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
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getallovertime();
    this.getIPAddress();
    this.checkpermission();
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
              permissionval.formName == 'MyOvertime' && permissionval.operationName.includes('View')
            );
          });
        }
      });
  }

  getallovertime() {
    this.spinner.start('data');
    this.api
      .callApi(this.constant.GETOVERTIEBYUSERID, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
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

    this.getallovertime();
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getallovertime();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getallovertime();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }


  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  showdata(row) {
    this.overtimeData = row;
    this.auth_creteria = row.auth_Criteria;

    this.api
      .callApi(
        this.constant.AUTHREQUESTDATABYREFERANCEOVERTIME + row.OverTimeID,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.authdata = res.data;

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

  clear(){
    this.datefilter.resetForm()
    this.filterData.startdate = ''
    this.filterData.enddate = ''
    this.getallovertime();
  }
}
