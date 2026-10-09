import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, id, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-lateearlyreport',
    templateUrl: './lateearlyreport.component.html',
    styleUrls: ['./lateearlyreport.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class LateearlyreportComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  selected: any = [];
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
    fromDate: '',
    toDate: '',
    companyID: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  body = {
    page: 1,
    limit: 10,
    searchQuery: '',
    id: localStorage.getItem('company_id'),
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
  alluser: any;
  company1: any;
  designation1: any;
  image: any;
  target: any;
  resultColumns: any[];
  childcompany: string;
  cid: string;
  selected1: any = [];
  companydata: any;
  allbranch: any = [];
  selected2: any = [];
  salary: boolean;
  public users: Array<any> = [];
  employee: any;
  branchfilter: boolean = false;
  employeedata: any;
  rows1: any;
  rows2: any;
  selectedValue: any;
  // date11: any = new Date().toISOString().slice(0, 10);

  date11 = new Date();
  date12: any;
  currentPage: number;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
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
    this.cid = localStorage.getItem('company_id');
    this.date11.setDate(this.date11.getDate() - 1);
    this.date12 = this.date11.toISOString().slice(0, 10);

    this.filterData = {
      page: 1,
      limit: 10,
      fromDate: '',
      toDate: '',
      companyID: '',
    };
    this.page = {
      totalCount: 0,
      offset: 0,
    };
    this.body = {
      page: 1,
      limit: 10,
      searchQuery: '',
      id: localStorage.getItem('company_id'),
    };

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
              permissionval.formName == 'LateInEarlyByReport' &&
              permissionval.operationName.includes('View')
            );
          });
          // this.permissioncreate = permission.filter(permissionval => { return permissionval.formName == 'Department' && permissionval.operationName.includes('Create') });
          this.spinner.stop();
        }
      });
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }
    if (
      new Date(this.datefilter.value.startdate) > new Date(this.datefilter.value.enddate) ||
      this.datefilter.value.startdate > this.date12 ||
      this.datefilter.value.enddate > this.date12
    ) {
      this.notifications.create(
        'Invalid Date range',
        'Please enter proper Date range',
        NotificationType.Error,
        {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        },
      );
      return;
    }

    // this.filterData.page = 1;
    this.filterData.companyID = this.datefilter.value.company;
    this.filterData.fromDate = this.datefilter.value.startdate;
    this.filterData.toDate = this.datefilter.value.enddate;

    let queryString = `?companyMasterID=${this.datefilter.value.company}&fromDate=${this.datefilter.value.startdate}&toDate=${this.datefilter.value.enddate}&page=${this.filterData.page}&limit=${this.filterData.limit}`;

    this.spinner.start('search');
    this.api
      .callApi(this.constant.LATEINEARLYGOREPORT + queryString, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.filter = 'filter';
          this.rows = res.data;
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.filterData.page;
            this.itemsPerPage = this.filterData.limit;
          }, 100);
        }
        this.spinner.stop('search');
      });
  }
  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    this.filterData.page = e.offset + 1;
    this.onSubmit();
  }

  onLimitChange(ev: any) {
    this.filterData.limit = ev;
    this.onSubmit();
  }

  clear() {
    window.location.reload();
  }

  download() {
    if (!this.datefilter.valid) {
      return;
    }
    if (!this.selectedValue && this.selectedValue == null) {
      return;
    }

    let queryString = `?companyMasterID=${this.datefilter.value.company}&fromDate=${this.datefilter.value.startdate}&toDate=${this.datefilter.value.enddate}&exportData=true&exportFileType=${this.selectedValue}`;

    this.spinner.start('download');
    this.api
      .callApi(this.constant.LATEINEARLYGOREPORT + queryString, {}, 'GET', true, false, true, true)
      .subscribe((res: any) => {
        if (this.selectedValue == 'csv') {
          var blob = new Blob([res], { type: 'text/csv' });
          saveAs(blob, 'LateInEarlyByReport.csv');
        } else {
          var blob = new Blob([res], { type: 'text/xlsx' });
          saveAs(blob, 'LateInEarlyByReport.xlsx');
        }
        this.spinner.stop('download');
      });
  }
}
