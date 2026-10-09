import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { saveAs } from 'file-saver';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
@Component({
    selector: 'app-list-kra',
    templateUrl: './list-kra.component.html',
    styleUrls: ['./list-kra.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListKraComponent implements OnInit {
  @ViewChild('companyfilter') companyfilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  rows = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;
  myInputVariable: ElementRef;

  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  Order = { label: 'Title', value: 'title' };
  changeOrderBy = [
    { label: 'Tile', value: 'title' },
    { label: 'Description', value: 'description' },
    { label: 'Created By', value: 'createdBy' },
  ];
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;

  body = {
    page: 1,
    limit: 10,
    searchQuery: '',
    company_id: Number(localStorage.getItem('company_id')),
    sortByField: '',
    sortByValue: 'ASC',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };

  events: any;
  filter: any;
  export: any;
  excelevents: any;
  permissioncreate: any = [1];
  permissionedit: any = [1];
  permissionview: any = [1];
  permissiondelete: any = [1];
  limit = 10;
  usertype: any;
  company_id: any;
  file: any;
  childcompany: string;
  ipAddress: any;
  comp: any;
  selectedValue: string;
  queryStringDownload: string;
  query: string;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private http: HttpClient,
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
      company_id: Number(localStorage.getItem('company_id')),
      sortByField: '',
      sortByValue: 'ASC',
    };

    this.page = {
      totalCount: 0,
      offset: 0,
    };
    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getKRAData();
    this.getcompany();
  }
  getKRAData() {
    this.spinner.start('start');
    let queryString = `?page=${this.body.page}&pageSize=${this.body.limit}`;
    if (this.body.company_id) {
      queryString += `&companyMasterID=${this.body.company_id}`;
    }

    if (this.body.searchQuery) {
      queryString += `&search=${this.body.searchQuery}`;
    }

    if (this.body.sortByField) {
      queryString += `&sortByField=${this.body.sortByField}&sortByValue=${this.body.sortByValue}`;
    }

    this.query = queryString;

    this.api.callApi(this.constant.GETALLKRA + queryString, {}, 'GET', true, false, true).subscribe(
      (res: any) => {
        this.rows = res.data;
        // this.filter = "main";
        this.temp = [...this.rows];
        this.page.totalCount = res.totalcount;
        this.spinner.stop('start');
      },
      (err) => {
        this.notifications.create('Error', 'Someting Went Wrong!', NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop('start');
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
            return permissionval.formName == 'KRA' && permissionval.operationName.includes('View');
          });
          this.spinner.stop();
        }
      });
  }

  onChangeOrderBy(event): void {
    this.body.sortByField = event.value;
    this.getKRAData();
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.body.searchQuery = '';
      setTimeout(() => {
        this.getKRAData();
      }, 100);
    } else {
      this.body.searchQuery = inputValue;
      this.getKRAData();
    }
  }


  onSubmit() {
    if (!this.companyfilter.valid) {
      return;
    }
    this.body.company_id = this.companyfilter.value.companyMasterID;
    this.getKRAData();
  }
  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }
  onChange(e: any) {
    if (e) {
      this.body.page = e.offset + 1;
      this.getKRAData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.body.limit = ev;
      this.limit = this.body.limit;
      this.getKRAData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  clear() {
    this.companyfilter.resetForm();
    this.ngOnInit();
  }

  onOptionSelect() {
    if (!this.selectedValue && this.selectedValue == null) {
      return;
    }
    this.spinner.start('a');
    this.api
      .callApi(
        this.constant.GETALLKRA +
          this.query +
          `&exportFileType=${this.selectedValue}&exportData=true`,
        {},
        'GET',
        true,
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          if (this.selectedValue == 'csv') {
            var blob = new Blob([res], { type: 'text/csv' });
            saveAs(blob, 'KRA.csv');
            this.selectedValue = null;
            this.spinner.stop('a');
          } else {
            var blob = new Blob([res], { type: 'text/xlsx' });
            saveAs(blob, 'KRA.xlsx');
            this.selectedValue = null;
            this.spinner.stop('a');
          }
        },
        (err) => {
          this.selectedValue = null;
          this.handleError('Something Went Wrong!');
          this.spinner.stop('a');
        },
      );
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.comp = res.data;
          this.spinner.stop('company');
        } else {
          this.handleError('Something Went Wrong!');
          this.spinner.stop('company');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('company');
      },
    );
  }
}
