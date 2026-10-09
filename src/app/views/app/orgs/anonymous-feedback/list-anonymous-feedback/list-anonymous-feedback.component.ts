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
    selector: 'app-list-anonymous-feedback',
    templateUrl: './list-anonymous-feedback.component.html',
    styleUrls: ['./list-anonymous-feedback.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListAnonymousFeedbackComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  filterform = {
    companyMasterID: Number(localStorage.getItem('company_id')),
    page: 1,
    limit: 10,
    searchQuery: '',
    enddate: '',
    startdate: '',
  };
  rows: any = [];
  rows1: any = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;
  scrollBarHorizontal = window.innerWidth < 1201;
  columns = [];
  temp = [];
  filterData1: any;
  ipAddress: any;
  company_id: number;
  company: any;
  formValue: any;
  querystring: string;
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  filterData = {
    // companyMasterID: Number(localStorage.getItem('company_id')),
    companyMasterID: Number(localStorage.getItem('company_id')),
    page: 1,
    limit: 10,
    searchQuery: '',
    enddate: '',
    startdate: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  limit = 10;
  currentPage: number;
  date12: any;
  resultColumns: any = [];
  permissionview: any = [];
  companydata: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
  ) { }
  ngOnInit(): void {
    this.company_id = +localStorage.getItem('company_id');
    this.checkpermission();
    this.getcompany();
    this.getdata();
    this.companydata = Number(localStorage.getItem('company_id'));
    if (this.formValueStorageService.isEmptyObject('ListAnonymousFeedbackComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        searchQuery: '',
        companyMasterID: Number(localStorage.getItem('company_id')),
        enddate: '',
        startdate: '',
      };
    } else {
      this.filterData = this.formValue.ListDillerComponent.body;
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };
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
              permissionval.formName == 'AuthorizationReplace' &&
              permissionval.operationName.includes('View')
            );
          });
          // this.permissionedit = permission.filter((permissionval) => {
          //   return (
          //     permissionval.formName == 'AuthorizationReplace' &&
          //     permissionval.operationName.includes('Edit')
          //   );
          // });

          this.spinner.stop();
        }
      });
  }


  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start('company');
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {

          this.companydata = res.data;
          this.spinner.stop('company');
        }
      });
  }

  download() {

    let boyd1 = {
      "page": 1,
      "limit": 10,
      companyMasterID: this.datefilter.value.companyMasterID,
      startdate: this.datefilter.value.startdate,
      enddate: this.datefilter.value.enddate,
      Export: true
    }

    this.spinner.start('download');
    this.api
      .callApi(
        this.constant.GETANONYMOUSFEEDBACK, boyd1,
        'POST',
        true,
        false,
        true,
        true,

      )
      .subscribe(
        (res: any) => this.handleFileDownload(res),
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('download');
        },
      );
  }

  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'Anonymous Feedback.xlsx');
    this.spinner.stop('download');
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }

    this.filterData.companyMasterID = this.datefilter.value.companyMasterID;
    this.filterData.startdate = this.datefilter.value.startdate;
    this.filterData.enddate = this.datefilter.value.enddate;

    this.getdata();
  }


  getdata() {
    this.spinner.start('data');
    this.api
      .callApi(
        this.constant.GETANONYMOUSFEEDBACK,
        this.filterData,
        'POST',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;

            this.temp = [...this.rows];
            this.page.totalCount = res.totalcount;
            setTimeout(() => {
              this.currentPage = this.filterData.page;
              this.itemsPerPage = this.filterData.limit;
            }, 100);
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



  clear() {
    this.spinner.start('clear');
    this.datefilter.resetForm();
    this.rows = [];
    this.resultColumns = [];
    this.spinner.stop('clear');
  }




  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();

    if (inputValue.length == 0) {
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.getdata();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getdata();
    }
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getdata();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getdata();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

}
