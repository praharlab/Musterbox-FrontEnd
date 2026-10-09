import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { saveAs } from 'file-saver';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-unassigned-biometric-code',
    templateUrl: './unassigned-biometric-code.component.html',
    styleUrls: ['./unassigned-biometric-code.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class UnassignedBiometricCodeComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: +localStorage.getItem('company_id'),
    exportData: false,
    biometricSerialNo: []
  };
  company1: any;
  selectedBiometric: any[] = [];
  allBiometric: any;
  isResetForm: boolean = false;

  rows = [];
  allRows = [];  // Store all rows for pagination
  page = {
    totalCount: 0,
    offset: 0,
  };
  biometricSerialNo: any = [];
  selectedSerial: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private notifications: AppNotificationService,
    private formValueStorageService: FormValueStorageService,
  ) { }

  ngOnInit() {
    this.filterData.companyMasterID = +localStorage.getItem('company_id');
    this.BiometricSerial()
  }


  BiometricSerial() {
    const filterData1 = {
      page: '',
      limit: '',
      companyMasterID: this.filterData.companyMasterID,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETBIOMETRICINTEGRATIONBYCHILDPARENTCOMPANY, filterData1, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          if (res.data) {
            this.allBiometric = res.data;
            this.selectAllForDropdownItems(this.allBiometric);
          }
          this.spinner.stop();
        }
      });
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }

    this.filterData.page = 1;
    this.filterData.limit = 10;
    this.filterData.biometricSerialNo = this.datefilter.value.biometricSerialNo;
    this.getData();
  }

  // Update getData to fetch all rows at once and paginate on the frontend
  getData() {
    this.spinner.start();
    this.api
      .callApi(this.constant.CHECKUNASSIGNEDEMPLOYEECODEDATA, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.allRows = res.data; // Store all rows
            this.page.totalCount = res.totalcount;
            this.updateDisplayedRows();
            this.spinner.stop();
          } else {
            this.handleError(res.message);
            this.spinner.stop();
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop();
        },
      );
  }

  // Update the displayed rows based on the page number and limit
  updateDisplayedRows() {
    const startIndex = (this.filterData.page - 1) * this.filterData.limit;
    const endIndex = startIndex + this.filterData.limit;
    this.rows = this.allRows.slice(startIndex, endIndex);
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.updateDisplayedRows();  // Update rows based on the current page
    } else {
      console.log('error');
    }
  }

  clear() {
    this.isResetForm = true;
    this.datefilter.resetForm();

    setTimeout(() => {
      this.rows = [];
      this.filterData = {
        page: 1,
        limit: 10,
        companyMasterID: +localStorage.getItem('company_id'),
        exportData: false,
        biometricSerialNo: []
      };
      this.page = {
        totalCount: 0,
        offset: 0,
      };
      this.ngOnInit();
    }, 200);

    this.isResetForm = false;
  }

  download() {
    if (!this.datefilter.valid) {
      return;
    }

    let body1 = {
      page: '',
      limit: '',
      companyMasterID: this.filterData.companyMasterID,
      biometricSerialNo: this.filterData.biometricSerialNo,
      exportData: true,
    };

    this.spinner.start('download');
    this.api
      .callApi(this.constant.CHECKUNASSIGNEDEMPLOYEECODEDATA, body1, 'POST', true, false, true, true)
      .subscribe((res: any) => {
        this.handleFileDownload(res);
        this.spinner.stop('download');
      });
  }

  private handleSuccess(message: any) {
    this.notifications.create('Done', message, NotificationType.Bare, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: true,
    });
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
    saveAs(blob, 'Un-Assigned Biometric Code.xlsx');
    this.spinner.stopLoader('master2');
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'All';
      });
    };
    allSelect(items);
  }
}
