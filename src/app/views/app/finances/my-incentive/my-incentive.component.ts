import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';


@Component({
    selector: 'app-my-incentive',
    templateUrl: './my-incentive.component.html',
    styleUrls: ['./my-incentive.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MyIncentiveComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  filterData = {
    userId: localStorage.getItem('id'),
    page: 1,
    limit: 10,
    fromMonth: '',
    toMonth: '',
    search: ''
  }
  page = {
    totalCount: 0,
    offset: 0,
  };
  rows: any = [];
  permissionview: any = [];
  limit: number = 10;
  startMonth: any;
  endMonth: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,


  ) { }

  ngOnInit(): void {
    this.filterData = {
      userId: localStorage.getItem('id'),
      page: 1,
      limit: 10,
      fromMonth: '',
      toMonth: '',
      search: ''
    }
    this.page = {
      totalCount: 0,
      offset: 0,
    };
    this.checkpermission()
    this.getIncentiveData()

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

          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'MyIncentive' &&
              permissionval.operationName.includes('View')
            );
          });

          this.spinner.stop('permission');
        }
      });
  }

  getIncentiveData() {
    let querystring = `?userMasterID=${this.filterData.userId}&page=${this.filterData.page}&limit=${this.filterData.limit}`

    if (this.filterData.fromMonth && this.filterData.toMonth) {
      querystring += `&fromMonth=${this.filterData.fromMonth}&toMonth=${this.filterData.toMonth}`;
    }

    if (this.filterData.search) querystring += `&search=${this.filterData.search}`

    this.spinner.start('getdata');
    this.api
      .callApi(
        this.constant.GETMYINCENTIVELIST + querystring,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.page.totalCount = res.totalcount

        } else {
          this.handleError(res.message);
        }
        this.spinner.stop('getdata');
      }, (err) => {
        this.spinner.stop('getdata');
      });
  }

  onSubmit() {
    if (!this.datefilter.valid) return
    this.filterData.fromMonth = this.datefilter.value.startmonth.replace('-', '')
    this.filterData.toMonth = this.datefilter.value.tomonth.replace('-', '')
    this.getIncentiveData();

  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getIncentiveData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getIncentiveData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  updateFilter(event) {
    const searchValue = event.target.value.trim().toLowerCase();

    this.filterData.search = searchValue
    this.getIncentiveData();
  }

  selectmonth() {


    this.startMonth = this.datefilter.value.startmonth
    this.endMonth = this.datefilter.value.tomonth
    if (this.datefilter.value.startmonth && this.datefilter.value.tomonth) {

      if (+this.datefilter.value.startmonth.replace('-', '') > +this.datefilter.value.tomonth.replace('-', '')) {
        this.startMonth = ''
        this.endMonth = ''

        return this.handleError('To Month must be grater or equal to From Month')
      }

    }
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  clear() {
    this.datefilter.resetForm();
    this.ngOnInit();
  }

}
