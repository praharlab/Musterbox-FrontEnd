import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';


import { saveAs } from 'file-saver';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';


@Component({
    selector: 'app-subadmin-company-master',
    templateUrl: './subadmin-company-master.component.html',
    styleUrls: ['./subadmin-company-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SubadminCompanyMasterComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = ['CompanyLogo', 'CompanyName', 'Plan', 'Subscription Start Date', 'Subscription End Date', 'cpMobileNo', 'CompanyEmail', 'City', 'Status'];
  SelectionType = SelectionType;
  tabledata = [
    'CompanyLogo',
    'CompanyName',
    'CompanyEmail',
    'CompanyAddress',
    'cpName',
    'cpMobileNo',
    'cpEmail',
    'City',
    'CompanyWebsite',
    'CompanyType',
    'Status',
    'CreatedAt',
    'UpdatedAt',
    'PanNumber',
    'TanNumber',
    'Plan',
    'Subscription Start Date',
    'Subscription End Date'
  ];
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    name: '',
    searchQuery: '',
    enddate: '',
    startdate: ''
  };

  body1 = {
    page: 1,
    limit: 10,
    startdate: '',
    enddate: '',
    name: '',
    searchQuery: '',
  };
  body = {
    page: 1,
    limit: 10,
    searchQuery: '',
    name: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  events: any;
  filter: any;
  export: any;
  excelevents: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  limit = 10;
  usertype: any;
  company_id: any;
  childcompany: string;
  name: string;
  querystring: string;
  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    private notifications: AppNotificationService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getcompanydata();
    this.checkpermission();
  }




  getcompanydata() {
    this.name = this.activatedRoute.snapshot.params.name;

    let string = `?page=${this.body1.page}&limit=${this.body1.limit}`;

    if (this.body1.searchQuery) string += `&searchQuery=${this.body1.searchQuery}`;
    if (this.body1.startdate) string += `&startdate=${this.body1.startdate}`;
    if (this.body1.enddate) string += `&enddate=${this.body1.enddate}`;

    string += `&name=${this.name}`;

    this.querystring = string

    if (this.usertype == 2 || this.usertype == 3) {
      this.spinner.start('start');
      this.api
        .callApi(this.constant.GETCOMPANYDATASUBADMIN + string, {}, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200 && res.data) {
            this.rows = res.data;

            for (let item of this.rows) {
              item.plan = item.companySubscriptions[0].productMaster.productName
              item.startDate = item.companySubscriptions[0].startDate
              item.endDate = item.companySubscriptions[0].endDate
            }
            this.rows
            this.filter = 'main';
            this.temp = [...this.rows];
            this.page.totalCount = res.totalcount;
          }
          this.spinner.stop('start');
        });
    }
  }



  checkpermission() {
    if (this.usertype != 2 && this.usertype != 3) {
      this.spinner.start('start');
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
                permissionval.formName == 'Company' &&
                permissionval.operationName.includes('Delete')
              );
            });
            this.permissionedit = permission.filter((permissionval) => {
              return (
                permissionval.formName == 'Company' && permissionval.operationName.includes('Edit')
              );
            });
            this.permissionview = permission.filter((permissionval) => {
              return (
                permissionval.formName == 'Company' && permissionval.operationName.includes('View')
              );
            });
            this.permissioncreate = permission.filter((permissionval) => {
              return (
                permissionval.formName == 'Company' &&
                permissionval.operationName.includes('Create')
              );
            });
            this.spinner.stop('start');
          }
        });
    } else {
      this.permissioncreate = [1];
      this.permissionedit = [1];
      this.permissionview = [1];
      this.permissiondelete = [1];
    }
  }

  updateFilter(event): void {
    this.events = event;
    this.excelevents = event.target.value;
    const val = event.target.value.toLowerCase().trim();

    this.body.name = this.name;

    this.body1.searchQuery = val;
    this.getcompanydata();

  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (this.filter == 'main') {
      this.body1.page = e.offset + 1;
      this.ngOnInit();
    } else if (this.filter == 'search') {
      this.body.page = e.offset + 1;
      this.updateFilter(this.events);
    } else if (this.filter == 'filter') {
      this.body1.page = e.offset + 1;
    } else {
      console.log('error');
    }
  }

  onLimitChange(ev: any) {
    if (this.filter == 'main') {
      this.body1.limit = ev;
      this.limit = this.body1.limit;
      this.ngOnInit();
    } else if (this.filter == 'search') {
      this.body.limit = ev;
      this.limit = this.body.limit;
      this.updateFilter(this.events);
    } else if (this.filter == 'filter') {
      this.body1.limit = ev;
      this.limit = this.body1.limit;
    } else {
      console.log('error');
    }
  }

  downloadFile() {
    if (this.usertype == 2 || this.usertype == 3) {
      this.spinner.start('start');
      this.api
        .callApi(this.constant.GETCOMPANYDATASUBADMIN + this.querystring + `&exportData=true`, {}, 'POST', true, false, true, true)
        .subscribe(
          (res: any) => this.handleFileDownload(res),
          (err) => {
            this.handleError(err.error.message);
            this.spinner.stop('start');
          },
        );
      this.spinner.stop('start');
    }
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'Contractor.xlsx');
    this.spinner.stop('download');
  }


  clear() {
    window.location.reload();
  }
  changeshowfields() {
    this.ngOnInit();
  }
  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }

    this.body1.startdate = this.datefilter.value.startdate;
    this.body1.enddate = this.datefilter.value.enddate;

    this.getcompanydata();
  }

}