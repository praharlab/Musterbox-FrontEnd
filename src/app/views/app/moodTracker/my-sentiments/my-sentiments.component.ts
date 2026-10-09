import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-my-sentiments',
    templateUrl: './my-sentiments.component.html',
    styleUrls: ['./my-sentiments.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MySentimentsComponent implements OnInit {
  @ViewChild('companyfilter') companyfilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;


  rows = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;

  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  Order = { label: 'Mood', value: 'mood' };
  changeOrderBy = [{ label: 'Mood', value: 'mood' }];

  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  body = {
    page: 1,
    limit: 10,
    searchQuery: '',
    sortByField: '',
    sortByValue: 'ASC',
    mood: '',
    startdate: '',
    enddate: '',
    userMasterId: localStorage.getItem('id'),
  };
  page = {
    totalCount: 0,
    offset: 0,
  };

  permissionview: any = [];
  limit = 10;
  company_id: any;
  comp: any;
  selectedValue: string;
  query: string;

  allbranch: any = [];
  employee: any;
  selectedCompany: any;
  enddate1: Date;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private notifications: AppNotificationService,
    private router: Router,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.limit = 10;
    this.body = {
      page: 1,
      limit: 10,
      searchQuery: '',
      sortByField: '',
      sortByValue: 'ASC',
      mood: '',
      startdate: '',
      enddate: '',
      userMasterId: localStorage.getItem('id'),
    };

    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.company_id = localStorage.getItem('company_id');
    this.getSentimentsData();
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
          this.comp = res.data;
          this.spinner.stop();
        }
      });
  }

  selectcompany(id) {
    if (!id) return;
    this.companyfilter.resetForm();
    this.selectedCompany = id;
    this.allbranch = [];
    this.employee = [];
    let bb = {
      page: '',
      limit: '',
      companyMasterID: id,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.employee = res.data;
        }
      });

    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;
        this.spinner.stop();
      });
  }

  selectbranch(id) {
    this.employee = [];
    if (!id) return;
    let bb = {
      branchMasterID: id,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.employee = res.data;
          this.spinner.stop();
        }
      });
  }

  // getSentimentsData() {
  //   this.spinner.start();

  //   let queryString = `?page=${this.body.page}&pageSize=${this.body.limit}&userMasterID=${this.body.userMasterId}`;

  //   if (this.body.mood) {
  //     queryString += `&mood=${this.body.mood}`;
  //   }

  //   if (this.body.startdate && this.body.enddate) {
  //     queryString += `&startDate=${this.body.startdate}&endDate=${this.body.enddate}`;
  //   }

  //   if (this.body.sortByField) {
  //     queryString += `&sortByField=${this.body.sortByField}&sortByValue=${this.body.sortByValue}`;
  //   }

  //   if (this.body.searchQuery) {
  //     queryString += `&search=${this.body.searchQuery}`;
  //   }

  //   this.query = queryString;

  //   this.api
  //     .callApi(this.constant.SENTIMENTPUNCHINAPI + queryString, {}, 'GET', true, false, true)
  //     .subscribe(
  //       (res: any) => {
  //         this.rows = res.data;
  //         this.temp = [...this.rows];
  //         this.page.totalCount = res.totalcount;
  //         this.spinner.stop();
  //       },
  //       (err) => {
  //         this.notifications.create('Error', 'Someting Went Wrong!', NotificationType.Error, {
  //           theClass: 'outline primary',
  //           timeOut: 3000,
  //           showProgressBar: false,
  //         });
  //         this.spinner.stop();
  //       },
  //     );
  // }

  
  getSentimentsData() {
    this.spinner.start();

    this.api
      .callApi(this.constant.GETSENTIMENTPUNCHINAPI, this.body, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          this.rows = res.data;
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          this.spinner.stop();
        },
        (err) => {
          this.notifications.create('Error', 'Someting Went Wrong!', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        },
      );
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
              permissionval.formName == 'MySentiment' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  onChangeOrderBy(event): void {
    this.body.sortByField = event.value;
    this.getSentimentsData();
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.ngOnInit();
      this.body.searchQuery = '';
    }

    if (inputValue.length >= 3) {
      this.body.searchQuery = inputValue;
      this.getSentimentsData();
    }
  }

  selectfrom() {
    this.enddate1 = new Date();
  }

  onSubmit() {
    if (!this.companyfilter.valid) {
      return;
    }

    if (
      (!this.companyfilter.value.startdate && this.companyfilter.value.enddate) ||
      (this.companyfilter.value.startdate && !this.companyfilter.value.enddate)
    ) {
      this.notifications.create(
        'Error',
        'Start & End date both Required!',
        NotificationType.Error,
        {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        },
      );
      return;
    }
    this.body.mood = this.companyfilter.value.mood;
    this.body.startdate = this.companyfilter.value.startdate;
    this.body.enddate = this.companyfilter.value.enddate;
    this.getSentimentsData();
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.body.page = e.offset + 1;
      this.getSentimentsData();
    } else {
      console.log('error');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.body.limit = ev;
      this.limit = this.body.limit;
      this.getSentimentsData();
    } else {
      console.log('error');
    }
  }

  clear() {
    this.companyfilter.resetForm();
    this.ngOnInit();
  }
}
