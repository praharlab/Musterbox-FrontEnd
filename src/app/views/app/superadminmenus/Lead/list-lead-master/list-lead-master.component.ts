import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { ColumnMode, DatatableComponent, id, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { saveAs } from 'file-saver';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { HttpClient } from '@angular/common/http';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-lead-master',
    templateUrl: './list-lead-master.component.html',
    styleUrls: ['./list-lead-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListLeadMasterComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  adminRoot = environment.adminRoot;
  // apiURL = environment.apiUrl;
  scrollBarHorizontal = window.innerWidth < 1201;
  company_id: any;
  comp: any;
  permissioncreate: any = [1];
  permissionedit: any = [1];
  permissionview: any = [1];
  permissiondelete: any = [1];
  filterData = {
    page: 1,
    limit: 10,
    searchQuery: '',
    registrationStatus: '',
    startdate: '',
    enddate: '',
  };
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  limit = 10;
  page = {
    totalCount: 0,
    offset: 0,
  };
  formValue: any;
  ipAddress: any;
  rows: any = [];
  currentPage: number;
  currentDate: string;
  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private http: HttpClient,
  ) {
    {
      window.onresize = () => {
        this.scrollBarHorizontal = window.innerWidth < 1201;
      };
    }
  }

  ngOnInit() {
    this.currentDate = new Date().toISOString().slice(0, 10);

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };
    this.getJoiningRequest();
  }
  selectfrom() {
    this.filterData.enddate = this.currentDate;
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
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }


  downloadFile() {
    this.spinner.start('start');

    let queryString = `?&exportData=true`;
    if (this.filterData.searchQuery) {
      queryString += `&searchQuery=${this.filterData.searchQuery}`;
    }
    if (this.filterData.registrationStatus) {
      queryString += `&registrationStatus=${this.filterData.registrationStatus}`;
    }
    if (this.filterData.startdate) {
      queryString += `&startdate=${this.filterData.startdate}`;
    }
    if (this.filterData.enddate) {
      queryString += `&enddate=${this.filterData.enddate}`;
    }
    this.api
      .callApi(this.constant.GETALLLEADMASTERDATA + queryString, {}, 'GET', true, false, true, true)
      .subscribe(
        (res: any) => this.handleFileDownload(res),
        (err) => {
          this.handleError(err);
          this.spinner.stop('start');
        },
      );
  }

  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'Lead Master.xlsx');
    this.spinner.stop('start');
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }
    this.getJoiningRequest();
  }
  getJoiningRequest() {
    
    let queryString = `?page=${this.filterData.page}&limit=${this.filterData.limit}`;
    if (this.filterData.searchQuery) {
      queryString += `&searchQuery=${this.filterData.searchQuery}`;
    }
    if (this.filterData.registrationStatus) {
      queryString += `&registrationStatus=${this.filterData.registrationStatus}`;
    }
    if (this.filterData.startdate && this.filterData.enddate) {
      queryString += `&startdate=${this.filterData.startdate}`;
      queryString += `&enddate=${this.filterData.enddate}`;
    }

    this.spinner.start('Requests');
    this.api
      .callApi(this.constant.GETALLLEADMASTERDATA + queryString, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.page.totalCount = res.totalcount;
            setTimeout(() => {
              this.currentPage = this.filterData.page;
              this.itemsPerPage = this.filterData.limit;
            }, 100);
            this.spinner.stop('Requests');
          } else {
            this.handleError(res.message);
            this.spinner.stop('Requests');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('Requests');
        },
      );
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getJoiningRequest();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getJoiningRequest();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }
  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.getJoiningRequest();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getJoiningRequest();
    }
  }
}
