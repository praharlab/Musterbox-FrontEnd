import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { HttpClient } from '@angular/common/http';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-total-punch-in-allcompany',
    templateUrl: './total-punch-in-allcompany.component.html',
    styleUrls: ['./total-punch-in-allcompany.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TotalPunchInAllcompanyComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  page = {
    totalCount: 0,
    offset: 0,
  };

   filterData = {
    page: 1,
    limit: 10,
    date:'',
    searchQuery:''
  };
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;
  scrollBarHorizontal = window.innerWidth < 1201;
  rows: any = []; 
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  columns: any[] = [];
  temp: any[] = [];
  currentPage: number;
  filterData1: any;
  ipAddress: any;
  company_id: number;
  company1: any;
  formValue: any;
  querystring: string;
  limit = 10;
  punchInCount = 0;
  currentDate: string;
 
  maxDate: string;
  date12: any;
  resultColumns: any[] = [];
  permissionview: any[] = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
  ) {}

  ngOnInit(): void {
    this.currentDate = new Date().toISOString().slice(0, 10);
    this.maxDate = new Date().toISOString().slice(0, 10);
   
    this.getPunchInCount();
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }


  getPunchInCount() {
    this.filterData.date =  this.currentDate
  
    this.spinner.start('astra');

    this.api.callApi(this.constant.TOTALPUNCHIN1, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.page.totalCount = res.totalCount;   
            setTimeout(() => {
              this.currentPage = this.filterData.page;
              this.itemsPerPage = this.filterData.limit;
            }, 100);
          }
          this.spinner.stop('astra');
        
        },
        (error) => {
          this.spinner.stop('astra');
        }
      );
  }

  onChangeOrderBy(event): void {
    this.filterData = event.value;
    this.getPunchInCount();
  }


  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();

    if (inputValue.length == 0) {
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.getPunchInCount();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getPunchInCount();
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getPunchInCount();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }


  clear() {
    this.datefilter.resetForm();
    setTimeout(() => {
      this.rows = [];
      this.ngOnInit();
    }, 200);
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getPunchInCount();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  dateSelected() {
    this.getPunchInCount();
}
  
  downloadFile() {

    const filterData = {
      date: this.currentDate,
      Export:true,
    };
    this.spinner.start('download');

    this.api
        .callApi(this.constant.TOTALPUNCHIN1, filterData, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => this.handleFileDownload(res),
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('download');
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

  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'PunchInCount.xlsx');
    this.spinner.stop('download');
  }
}