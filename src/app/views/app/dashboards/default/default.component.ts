import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-default',
    templateUrl: './default.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DefaultComponent implements OnInit {
  rows = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;

  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  page = {
    totalCount: 0,
    offset: 0,
  };
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: localStorage.getItem('company_id'),
  };
  body = {
    page: 1,
    limit: 10,
    searchQuery: '',
    companyMasterID: localStorage.getItem('company_id'),
  };
  events: any;
  filter: any;
  limit = 10;
  excelevents: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  export: any;
  usertype: any;
  dashboardRows: any = [];
  name: any = [];
  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
  ) {}

  ngOnInit() {
    // this.getdashboarddata();

    this.usertype = localStorage.getItem('usertype');

    this.getCompanyAnalyticsData();

    this.name = ['total', 'active', 'deactive', 'renewal','expiredplan'];
  }

  getdashboarddata() {
    this.spinner.start();

    this.api
      .callApi(this.constant.DASHBOARDDATA, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;

          this.spinner.stop();
        }
      });
  }

  getCompanyAnalyticsData() {
    this.spinner.start('1');
    this.api
      .callApi(this.constant.GETCOMPANYANALYTICSDATA, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.dashboardRows = res.data;

          this.spinner.stop('1');
        }
      });
  }

  // login()
  // {
  //   localStorage.clear();
  //   window.location.reload();
  // }
  updateFilter(event): void {
    this.events = event;
    this.excelevents = event.target.value;
    const val = event.target.value.toLowerCase().trim();
    (this.body.searchQuery = val),
      this.api
        .callApi(this.constant.DASHBOARDDATA, this.body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.filter = 'search';
            this.rows = res.data;
            this.temp = [...this.rows];
            this.page.totalCount = res.totalcount;
            this.spinner.stop();
          }
        });
  }
  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (this.filter == 'main') {
      this.filterData.page = e.offset + 1;
      this.ngOnInit();
    } else if (this.filter == 'search') {
      this.body.page = e.offset + 1;
      this.updateFilter(this.events);
    } else {
      console.log('error');
    }
  }

  onLimitChange(ev: any) {
    if (this.filter == 'main') {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.ngOnInit();
    } else if (this.filter == 'search') {
      this.body.limit = ev;
      this.limit = this.body.limit;
      this.updateFilter(this.events);
    } else {
      console.log('error');
    }
  }
  showAddNewModal() {}
  downloadFile() {
    let data = [];
    let mainbody = {
      page: '',
      limit: '',
    };
    this.api
      .callApi(this.constant.DASHBOARDDATA, mainbody, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.export = res.data;
          let totalUser, startDate, endDate, totalTracking;

          for (var i = 0; i < this.export.length; i++) {
            if (this.export[i].subscription == null) {
              totalUser = '';
              startDate = '';
              endDate = '';
              totalTracking = '';
            } else {
              if (
                this.export[i].subscription.totalUser == null ||
                this.export[i].subscription.totalUser == ''
              ) {
                totalUser = '';
              } else {
                totalUser = this.export[i].subscription.totalUser;
              }
              if (
                this.export[i].subscription.totalTracking == null ||
                this.export[i].subscription.totalTracking == ''
              ) {
                totalTracking = '';
              } else {
                totalTracking = this.export[i].subscription.totalTracking;
              }
              if (
                this.export[i].subscription.startDate == null ||
                this.export[i].subscription.startDate == ''
              ) {
                startDate = '';
              } else {
                startDate = this.export[i].subscription.startDate;
              }
              if (
                this.export[i].subscription.endDate == null ||
                this.export[i].subscription.endDate == ''
              ) {
                endDate = '';
              } else {
                endDate = this.export[i].subscription.endDate;
              }
            }
            const data1 = {
              CompanyId: this.export[i].companyMasterID,
              CompanyName: this.export[i].companyName,
              Email: this.export[i].companyEmail,
              TotalUser: totalUser,
              TotalTrackingUser: totalTracking,
              SubscriptionStart: startDate,
              SubscriptionEnd: endDate,
            };
            data.push(data1);
          }

          const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
          const header = Object.keys(data[0]);
          let csv = data.map((row) =>
            header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(','),
          );
          csv.unshift(header.join(','));
          let csvArray = csv.join('\r\n');

          var blob = new Blob([csvArray], { type: 'text/csv' });
          saveAs(blob, 'Company.csv');
        }
      });
  }
}
