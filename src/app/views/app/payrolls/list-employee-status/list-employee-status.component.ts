import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { saveAs } from 'file-saver';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-employee-status',
    templateUrl: './list-employee-status.component.html',
    styleUrls: ['./list-employee-status.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListEmployeeStatusComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('datefilter') datefilter: NgForm;

  rows = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;
  ColumnMode = ColumnMode;
  scrollBarHorizontal = window.innerWidth < 1201;

  filterData = {
    page: 1,
    limit: 10,
    companyMasterId: null,
    status: null,
    searchQuery: ''
  };


  comp: any;
  temp: any[];
  currentPage: number;
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  page = {
    totalCount: 0,
    offset: 0,
  };
  limit = 10;
  formValue: any;
  empleftstatus: boolean = false;
  employeestatus: string;

  constructor(
    private spinner: NgxUiLoaderService,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private formValueStorageService: FormValueStorageService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.filterData.companyMasterId = +this.formValue.EmployeeStatusComponent.id;
    this.getcompany();
    this.alldata();

  }


  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }
    // if (this.datefilter.value.status === 'all') {
    //   this.filterData.status = [0, 1]
    //   this.alldata();
    // } else {

    this.filterData.companyMasterId = this.datefilter.value.company;
    this.filterData.status = this.datefilter.value.status;
    this.alldata();


  }

  getcompany() {
    const body = {
      companyMasterID: this.formValue.EmployeeStatusComponent.id,
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

  alldata() {
    this.filterData.companyMasterId = +this.formValue.EmployeeStatusComponent.id;

    this.spinner.start('alldata');
    this.api
      .callApi(this.constant.VIEWEMPLOYEESTATUS, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.empleftstatus = false;
          if (this.rows.length > 0 && this.filterData.status == 2) {
            this.empleftstatus = true;
            // this.employeestatus =  'left'
          }
          // this.temp = [...this.rows];
          setTimeout(() => {
            this.currentPage = this.filterData.page;

            this.itemsPerPage = this.filterData.limit;
          }, 200);
          this.page.totalCount = res.totalcount;
        }
        this.spinner.stop('alldata');
      });
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.ngOnInit();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      // if (this.datefilter.value.status === 'all') {
      //   this.filterData.status = [0, 1]
      //   this.alldata();
      // }
      this.alldata();
    }
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  clear() {
    this.datefilter.resetForm();
    this.formValueStorageService.removeData('ListEmployeeStatusComponent', false);
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.alldata();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }


  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.alldata();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }


  downloadFile() {
    let body = {
      companyMasterId: this.formValue.EmployeeStatusComponent.id,
      status: this.filterData.status,
      exportData: true,
    };

    this.spinner.start('main');
    this.api
      .callApi(this.constant.VIEWEMPLOYEESTATUS, body, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => {
          var blob = new Blob([res], { type: 'text/xlsx' });
          saveAs(blob, 'EmployeeStatus.xlsx');
          this.spinner.stop('main');
        },
        (err) => {
          this.notifications.create('Error', 'Something Went Wrong!', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('main');
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
}
