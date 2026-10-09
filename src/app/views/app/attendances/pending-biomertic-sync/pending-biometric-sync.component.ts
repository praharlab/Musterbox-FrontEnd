import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, id, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { saveAs } from 'file-saver';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-pending-biometric-sync',
    templateUrl: './pending-biometric-sync.component.html',
    styleUrls: ['./pending-biometric-sync.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PendingBiometricSyncComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  rows = [];
  rows1 = [];
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
    companyMasterID: '',
    serialNo: '',
    fromDate: '',
    toDate: '',
    status: '',
  };
  body1 = {
    page: 1,
    limit: 10,
    companyid: '',
    biometricSerialNo: '',
    biometricstatus: '',
    startdate: '',
    enddate: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  limit = 10;
  company_id: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  company1: any;
  filter: string;
  biometricSerialNo: any = [];
  selectedValue: any;
  all: boolean;
  pending: boolean;
  selectedSerial: any;
  image: any;
  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
  ) { }

  ngOnInit(): void {
    this.company_id = localStorage.getItem('company_id');
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
              permissionval.formName == 'BiometricAttendance' &&
              permissionval.operationName.includes('Download')
            );
          });
          this.spinner.stop();
        }
      });
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.onSubmit();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.onSubmit();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  BiometricSerial(serialNo) {
    this.biometricSerialNo = [];
    this.selectedSerial = '';

    if (!serialNo) {
      return;
    }
    this.company_id = serialNo;
    const filterData1 = {
      page: '',
      limit: '',
      companyMasterID: serialNo,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETTABLEANDDB, filterData1, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          if (res.data) {
            this.biometricSerialNo = res.data.biometricSerialNo;
          }
          this.spinner.stop();
        }
      });
  }
  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }
    if (this.datefilter.value.biometricstatus == 'all') {
      this.all = true;
      this.pending = false;
    }
    if (this.datefilter.value.biometricstatus == 'all') {
      this.all = false;
      this.pending = true;
    }

    this.filterData.companyMasterID = this.datefilter.value.company;
    this.filterData.serialNo = this.datefilter.value.SerialNo;
    this.filterData.fromDate = this.datefilter.value.startdate;
    this.filterData.toDate = this.datefilter.value.enddate;
    this.filterData.status = this.datefilter.value.Biometricstatus;

    this.spinner.start('oninit2');
    this.api
      .callApi(this.constant.PENDNGBIOMETRICSYNC, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.page.totalCount = res.totalcount;

            this.spinner.stop('oninit2');
          } else {
            this.handleError(res.message);
            this.spinner.stop('oninit2');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('oninit2');
        },
      );
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  download() {
    if (!this.datefilter.valid) {
      return;
    }
    if (!this.selectedValue && this.selectedValue == null) {
      return;
    }

    let body1 = {
      page: '',
      limit: '',
      companyMasterID: this.filterData.companyMasterID,
      serialNo: this.filterData.serialNo,
      fromDate: this.filterData.fromDate,
      toDate: this.filterData.toDate,
      exportData: true,
      exportFileType: this.selectedValue,
      status: this.filterData.status,
    };

    this.spinner.start('download');
    this.api
      .callApi(this.constant.PENDNGBIOMETRICSYNC, body1, 'POST', true, false, true, true)
      .subscribe((res: any) => {
        if (this.selectedValue == 'csv') {
          var blob = new Blob([res], { type: 'text/csv' });
          saveAs(blob, 'Biometric.csv');
        } else {
          var blob = new Blob([res], { type: 'text/xlsx' });
          saveAs(blob, 'Biometric.xlsx');
        }
        this.spinner.stop('download');
      });
  }
  clear() {
    this.rows = [];
    this.datefilter.resetForm();
  }

  editimage(image) {
    this.image = image;
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
