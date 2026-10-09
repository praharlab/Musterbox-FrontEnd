import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { HttpClient } from '@angular/common/http';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-myasset',
    templateUrl: './myasset.component.html',
    styleUrls: ['./myasset.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MyassetComponent implements OnInit {
  @ViewChild('filterdate') filterdate: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('closeModal') closeModal: ElementRef;
  rows = [];
  apiURL = environment.apiUrl;

  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  SelectionType = SelectionType;
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;

  body1 = {
    page: 1,
    limit: 10,
    startdate: '',
    enddate: '',
    userMasterID: localStorage.getItem('id'),
    searchQuery: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };

  tabledata = [];
  events: any;
  export: any;
  excelevents: any;
  field: any;
  allvalue: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];

  companyid: any;

  enddate: Date;
  log: any;
  attendanceForm: any;
  images: any = [];
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
  limit = 10;

  ngOnInit() {
    this.checkpermission();
    this.getEMPAsset();
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
              permissionval.formName == 'MyAssets' && permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'MyAssets' && permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'MyAssets' && permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'MyAssets' && permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  getEMPAsset() {
    this.spinner.start('oninit2');
    this.api
      .callApi(this.constant.GETEMPLOYEEASSET, this.body1, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.temp = [...this.rows];
            this.page.totalCount = res.totalcount;
            this.attendanceForm = res.attendacepolicydata;
            this.spinner.stop('oninit2');
          } else {
            this.handleError(res.message);
            this.spinner.stop('oninit2');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('oninit2');
        },
      );
  }

  onSubmit() {
    if (!this.filterdate.valid) {
      return;
    }
    this.body1.startdate = this.filterdate.value.startdate;
    this.body1.enddate = this.filterdate.value.enddate;

    this.getEMPAsset();
  }

  getImage(row: any) {
    this.images = row.assetImages;
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.body1.searchQuery = '';
      setTimeout(() => {
        this.getEMPAsset();
      }, 100);
    } else {
      this.body1.searchQuery = inputValue;
      this.getEMPAsset();
    }
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.body1.page = e.offset + 1;
      this.getEMPAsset();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.body1.limit = ev;
      this.limit = this.body1.limit;
      this.getEMPAsset();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  clear() {
    this.filterdate.resetForm();

    setTimeout(() => {
      this.body1 = {
        page: 1,
        limit: 10,
        startdate: '',
        enddate: '',
        userMasterID: localStorage.getItem('id'),
        searchQuery: '',
      };
      this.page = {
        totalCount: 0,
        offset: 0,
      };
      this.ngOnInit();
    }, 200);
  }

  selectfrom() {
    this.enddate = new Date();
  }

  padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }

  formatDate(date) {
    return (
      [
        this.padTo2Digits(date.getDate()),
        this.padTo2Digits(date.getMonth() + 1),
        date.getFullYear(),
      ].join('-') +
      ' ' +
      [
        this.padTo2Digits(date.getHours()),
        this.padTo2Digits(date.getMinutes()),
        this.padTo2Digits(date.getSeconds()),
      ].join(':')
    );
  }

  formatDate1(date) {
    return [
      this.padTo2Digits(date.getDate()),
      this.padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join('-');
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
