import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgForm } from '@angular/forms';
import { saveAs } from 'file-saver';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-company-leave-data',
    templateUrl: './company-leave-data.component.html',
    styleUrls: ['./company-leave-data.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class CompanyLeaveDataComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('datefilter') datefilter: NgForm;
  rows = [];
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: localStorage.getItem('company_id'),
    leavestatus: '',
    startdate: '',
    enddate: '',
    searchQuery: '',
    exportData: false,
    exportFileType: '',
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
  referencedata: any = [];
  authdata: any;
  company_id: string;
  company1: any;
  userName: any;
  auth_Criteria: any;
  leaveTypes: any;
  selectedValue: string;
  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,
    private notifications: AppNotificationService,
    private formValueStorageService: FormValueStorageService,
  ) {}

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();
    this.company_id = localStorage.getItem('company_id');

    this.filterData = {
      page: 1,
      limit: 10,
      companyMasterID: localStorage.getItem('company_id'),
      leavestatus: '',
      startdate: '',
      enddate: '',
      searchQuery: '',
      exportData: false,
      exportFileType: '',
    };
    this.getauthrequestdata();
    this.checkpermission();
    this.getcompany();
  }

  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };

    this.spinner.start('loader1');
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.company1 = res.data;
          this.spinner.stop('loader1');
        }else{
          this.notifications.create('Error', 'Something went wrong!', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('loader1');

        }
      });
  }

  getauthrequestdata() {
    this.spinner.start('loader');
    this.filterData.leavestatus = this.formValue.CompanyLeaveDataComponent.id;
    this.api
      .callApi(this.constant.LEAVEDATASHOW, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data.rows;
          this.temp = [...this.rows];
          this.page.totalCount = res.data.count;
          this.spinner.stop('loader');
        }else{
          this.notifications.create('Error', 'Something went wrong!', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('loader');

        }
      },(err) => {
        this.notifications.create('Error', err.error.message, NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop('loader');
      });
  }

  checkpermission() {
    this.spinner.start('loader');
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
              permissionval.formName == 'HrDashboard' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop('loader');
        }
      });
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
      this.getauthrequestdata();
    }
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getauthrequestdata();
    } else {
      console.log('error');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getauthrequestdata();
    } else {
      console.log('error');
    }
  }

  onSubmit1() {
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
      this.notifications.create('Error', 'start & end dates are required!', NotificationType.Bare, {
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

    this.getauthrequestdata();
  }

  clear() {
    this.datefilter.resetForm();
    this.ngOnInit();
  }

  showdata(row) {
    this.referencedata = row;
    this.userName = row['userMaster.displayName'];
    this.leaveTypes = row.leave;
    this.auth_Criteria = row.Auth_Criteria;
    this.api
      .callApi(
        this.constant.LEAVEAUTHREQUESTDATABYREFERANCE + row.UserLeaveApplicationID,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.authdata = res.data;
          this.spinner.stop('loader');
        }
      });
  }

  onOptionSelectDownlad() {
    if (!this.selectedValue && this.selectedValue == null) {
      return;
    }
    this.spinner.start('a');
    this.filterData.page = null;
    this.filterData.limit = null;
    this.filterData.exportFileType = this.selectedValue;
    this.filterData.exportData = true;
    this.api
      .callApi(this.constant.LEAVEDATASHOW, this.filterData, 'POST', true, false, true, true)
      .subscribe((res: any) => {
        if (this.selectedValue == 'csv') {
          var blob = new Blob([res], { type: 'text/csv' });
          saveAs(blob, 'Company-Loan-Report.csv');
          this.selectedValue = null;
          this.filterData.exportData = false;
          this.filterData.exportFileType = '';
          this.filterData.page = 1;
          this.filterData.limit = 10;
          this.spinner.stop('a');
        } else {
          var blob = new Blob([res], { type: 'text/xlsx' });
          saveAs(blob, 'Company-Leave-Report.xlsx');
          this.selectedValue = null;
          this.filterData.exportData = false;
          this.filterData.exportFileType = '';
          this.filterData.page = 1;
          this.filterData.limit = 10;
          this.spinner.stop('a');
        }
      });
  }
}



