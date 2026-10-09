
import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { saveAs } from 'file-saver';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-company-advance-payment',
    templateUrl: './company-advance-payment.component.html',
    styleUrls: ['./company-advance-payment.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class CompanyAdvancePaymentComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('datefilter') datefilter: NgForm;

  rows = [];
  columns = [];
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: localStorage.getItem('company_id'),
    advancestatus: '',
    exportData: false,
    exportFileType: '',
    startdate: '',
    searchQuery: '',
    enddate: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  limit = 10;

  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];

  company_id: string;
  company1: any;
  selectedValue: string;
  formValue: any;


  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,
    private notifications: AppNotificationService,
    private formValueStorageService: FormValueStorageService,

  ) { }

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();

    
    this.limit = 10;
    this.filterData = {
      page: 1,
      limit: 10,
      companyMasterID: localStorage.getItem('company_id'),
      advancestatus: '',
      exportData: false,
      exportFileType: '',
      startdate: '',
      searchQuery: '',
      enddate: '',
    };
    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.filterData.advancestatus = this.formValue.CompanyAdvancePaymentComponent.id;
    this.company_id = localStorage.getItem('company_id');
    this.getAdvanceData();
    this.checkpermission();
    this.getcompany();
  }

  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start("loader");
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.company1 = res.data;
          this.spinner.stop("loader");
        } else {
          this.handleCatchError();
        }
      },
      (err) => {
        this.handleCatchError();
      },
    );
  }

  getAdvanceData() {
    this.spinner.start("loader");
    this.api
      .callApi(this.constant.ADVANCEDATASHOW, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data.rows;
            this.temp = [...this.rows];
            this.page.totalCount = res.data.count;
            this.spinner.stop("loader");
          } else {
            this.handleCatchError();
          }
        },
        (err) => {
          this.handleCatchError();
        },
      );
  }

  checkpermission() {
    this.spinner.start("loader");
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api.callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          let permission = res.data;
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'HrDashboard' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop("loader");
        }
      },
      (err) => {
        this.handleCatchError();
      },
    );
  }



  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.ngOnInit();
      this.filterData.searchQuery = '';
    }

    if (inputValue.length >= 3) {
      this.filterData.searchQuery = inputValue;
      this.filterData.companyMasterID = localStorage.getItem('company_id');
      this.getAdvanceData();
    }
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getAdvanceData();
    } else {
      this.notifications.create('Error', 'something went wrong!', NotificationType.Bare, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getAdvanceData();
    } else {
      this.notifications.create('Error', 'something went wrong!', NotificationType.Bare, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });
    }
  }

  onSubmit() {
    if (
      !this.datefilter.value.company &&
      !this.datefilter.value.startdate &&
      !this.datefilter.value.enddate
    ) {
      return;
    }

    if (
      (this.datefilter.value.startdate && !this.datefilter.value.enddate) ||
      (!this.datefilter.value.startdate && this.datefilter.value.enddate)
    ) {
      this.notifications.create('Error', 'from & to dates are required!', NotificationType.Bare, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });
      return;
    }

    this.filterData.startdate = this.datefilter.value.startdate;
    this.filterData.enddate = this.datefilter.value.enddate;
    if (this.datefilter.value.company) {
      this.filterData.companyMasterID = this.datefilter.value.company;
    }
    this.getAdvanceData();
  }

  clear() {
    this.datefilter.resetForm();
    this.ngOnInit();
  }

  onOptionSelectDownlad() {
    if (!this.selectedValue && this.selectedValue == null) {
      return;
    }
    this.spinner.start("loader");
    this.filterData.page = null;
    this.filterData.limit = null;
    this.filterData.exportFileType = this.selectedValue;
    this.filterData.exportData = true;
    this.api
      .callApi(this.constant.ADVANCEDATASHOW, this.filterData, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => {
          if (this.selectedValue == 'csv') {
            var blob = new Blob([res], { type: 'text/csv' });
            saveAs(blob, 'Company-Advance-Report.csv');
            this.selectedValue = null;
            this.filterData.exportData = false;
            this.filterData.exportFileType = '';
            this.filterData.page = 1;
            this.filterData.limit = 10;
            this.spinner.stop("loader");
          } else {
            var blob = new Blob([res], { type: 'text/xlsx' });
            saveAs(blob, 'Company-Advance-Report.xlsx');
            this.selectedValue = null;
            this.filterData.exportData = false;
            this.filterData.exportFileType = '';
            this.filterData.page = 1;
            this.filterData.limit = 10;
            this.spinner.stop("loader");
          }
        },
        (err) => {
          this.handleCatchError();
        },
      );
  }

  handleCatchError() {
    this.spinner.stop("loader");
    this.notifications.create('Error', 'Something Went Wrong!', NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 2000,
      showProgressBar: false,
    });
  }
}




