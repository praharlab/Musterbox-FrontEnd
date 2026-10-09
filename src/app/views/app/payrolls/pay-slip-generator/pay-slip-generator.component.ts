import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {
  CommonFilterButtonFields,
  CommonFilterFields,
  ItemOptionsPerPageArray,
} from 'src/app/constants/CommonFilterFields';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { DownloadFileService } from 'src/app/services/download-file.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CommonUtils } from 'src/app/utils/common.utils';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { labelUtils } from 'src/app/constants/labelUtils';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-pay-slip-generator',
    templateUrl: './pay-slip-generator.component.html',
    styleUrls: ['./pay-slip-generator.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PaySlipGeneratorComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('lgModal', { static: false }) lgModal: ModalDirective;

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [
    CommonFilterButtonFields.Submit,
    CommonFilterButtonFields.Clear,
    CommonFilterButtonFields.Cancel,
  ];

  endDate: any;
  startDate: any;

  selectedMonth: any;
  selectedDateRange: any;
  apiUrl = environment.apiUrl;
  showGenerateAllButton: boolean = false;
  showSalarySlipData: any = {
    path: '',
  };

  filterData = {
    page: 1,
    limit: 10,
    companyMasterId: +localStorage.getItem('company_id'),
    userMasterID: [],
    month: '',
    Export: false,
    payrollFrequency: null,
    startDate: '',
    endDate: '',
  };

  permissionview: any = [];
  permissioncreate: any = [];
  adminRoot = environment.adminRoot;
  payslipData: any = [];
  page = {
    totalCount: 0,
    offset: 0,
  };
  currentPage: number;
  itemsPerPage: number = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  init: boolean = true;
  selectedFromMonth: any;
  selectedToMonth: any;
  payrollFrequencyType = labelUtils.payrollFrequencyType;
  years: number[] = [];
  selectedPayrollFrequencyType: string = '';
  dateRangeData: any[] = [];
  selectedYear: number;

  showGenerateButton: boolean = true;

  dateRangeBody = {
    payrollFrequency: '',
    year: '',
  };

  selectedPayRefTitle: any;


  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private commonNotificationService: CommonNotificationService,
    private downloadFileService: DownloadFileService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.checkpermission();
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 2000; i--) {
      this.years.push(i);
    }
  }

  selectYear(event?: any) {
    this.dateRangeBody.year = event;
    this.getDateRange();
  }

  changePayrollFrequency() {
    this.selectedDateRange = '';
    this.dateRangeBody.payrollFrequency = this.selectedPayrollFrequencyType;
    this.getDateRange();
  }

  getDateRange() {
    this.dateRangeData = [];

    if (
      !this.dateRangeBody.year ||
      !['Fortnightly', 'Weekly'].includes(this.selectedPayrollFrequencyType)
    )
      return;

    const body = {
      year: this.dateRangeBody.year,
      payrollFrequency: this.dateRangeBody.payrollFrequency,
    };

    this.spinner.start('getDate');
    this.api.callApi(this.constant.GETDATERANGE, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.dateRangeData = res.data;
          this.dateRangeData = this.dateRangeData.map((item) => ({
            ...item,
            value: `${item.title}(${item.from} - ${item.to})`,
          }));
        }
        this.spinner.stop('getDate');
      },
      (err) => {
        this.spinner.stop('getDate');
      },
    );
  }

  getEmployeePaySlipData() {
    this.spinner.start('main');
    this.api
      .callApi(this.constant.GETPAYSLIPGENERATORDATA, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.payslipData = res.data;
            this.init = false;

            if (this.payslipData.length > 0) {
              this.showButtons.push(CommonFilterButtonFields.Excel);
              this.showGenerateAllButton = true;
            } else {
              this.showGenerateAllButton = false;
              this.showButtons = [
                CommonFilterButtonFields.Submit,
                CommonFilterButtonFields.Clear,
                CommonFilterButtonFields.Cancel,
              ];
              if (this.permissioncreate.length) {
                this.showButtons.push(CommonFilterButtonFields.Import);
              }
            }
            this.page.totalCount = res.totalcount;
            setTimeout(() => {
              this.currentPage = this.filterData.page;
              this.itemsPerPage = this.filterData.limit;
            }, 100);
            this.spinner.stop('main');
          } else {
            this.spinner.stop('main');
            this.commonNotificationService.handleError(res.message);
          }
        },
        (err) => {
          this.spinner.stop('main');
          this.commonNotificationService.handleError(err.error.message);
        },
      );
  }

  onSubmit(val?: any) {
    if (val) {
      this.selectedPayRefTitle = null;
      this.filterData.companyMasterId = val.company;
      this.filterData.userMasterID = val.user;
      if (val.payrollFrequency == 'Monthly') {
        this.filterData.startDate = '';
        this.filterData.endDate = '';
        this.filterData.month = this.selectedMonth.replace('-', '');
        if (this.filterData.month == '') return;
      }
      this.filterData.Export = false;
      this.filterData.payrollFrequency = val.payrollFrequency;
      if (val.payrollFrequency == 'Fortnightly' || val.payrollFrequency == 'Weekly') {
        this.filterData.month = '';
        this.filterData.startDate = this.startDate;
        this.filterData.endDate = this.endDate;
        this.selectedPayRefTitle = this.selectedDateRange;
        if (this.filterData.startDate == '' || this.filterData.endDate == '') return;
      }
      this.getEmployeePaySlipData();
    }
  }

  getCompany(val?: any) {
    this.filterData.companyMasterId = val;
  }

  checkpermission() {
    this.spinner.start('permission');
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
              permissionval.formName == 'PaySlipGenerator' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'PaySlipGenerator' &&
              permissionval.operationName.includes('Create')
            );
          });
          if (this.permissioncreate.length) {
            this.showButtons.push(CommonFilterButtonFields.Import);
          }

          this.spinner.stop('permission');
        }
      });
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.page;
      this.getEmployeePaySlipData();
    } else {
      this.commonNotificationService.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.getEmployeePaySlipData();
    } else {
      this.commonNotificationService.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/payrolls/employee_bonus/add_employee_bonus']);
  }

  alertDeactiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Employee bonus is set to be canceled!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          attendancePolicyID: id,
          status: '0',
        };
        this.spinner.start('deactive');
        this.api
          .callApi(this.constant.CANCELEMPLOYEEBONUS + id, {}, 'GET', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.commonNotificationService.handleSuccess(res.message);
                this.getEmployeePaySlipData();
                this.spinner.stop('deactive');
              } else {
                this.commonNotificationService.handleError(res.message);
                this.spinner.stop('deactive');
              }
            },
            (err) => {
              this.commonNotificationService.handleError(err.error.message);
              this.spinner.stop('deactive');
            },
          );
      }
    });
  }

  clear() {
    this.filterData = {
      page: 1,
      limit: 10,
      companyMasterId: +localStorage.getItem('company_id'),
      userMasterID: [],
      month: '',
      Export: false,
      payrollFrequency: null,
      startDate: '',
      endDate: '',
    };
    this.payslipData = [];
    this.showGenerateAllButton = false;
    this.showButtons = [
      CommonFilterButtonFields.Submit,
      CommonFilterButtonFields.Clear,
      CommonFilterButtonFields.Cancel,
    ];
    if (this.permissioncreate.length) {
      this.showButtons.push(CommonFilterButtonFields.Import);
    }
    this.selectedFromMonth = '';
    this.selectedToMonth = '';
  }

  importExcel() {
    this.router.navigate([this.adminRoot + '/payrolls/paySlipGenerator/import_paySlip_Generator']);
  }

  generatePaySlip(data: any) {
    const body: any = {};
    body.userMasterID = [data?.userMasterID];
    body.payrollFrequency = data?.payrollFrequency;
    if (body.payrollFrequency == 'Monthly') {
      body.month = this.selectedMonth.replace('-', '');
    } else {
      body.startDate = data?.startDate;
      body.endDate = data?.endDate;
      body.payRefTitle = this.selectedPayRefTitle
    }
    this.spinner.start('generatePayslip');
    this.api.callApi(this.constant.GENERATEPAYSLIP, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        this.spinner.stop('generatePayslip');
        this.commonNotificationService.handleSuccess('Pay Slip generated successfully.');
        this.getEmployeePaySlipData();
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message);
        this.spinner.stop('generatePayslip');
      },
    );
  }

  viewPaySlip(data: any) {
    this.showSalarySlipData.path = this.apiUrl + data?.paySlip[0]?.path;
    this.lgModal.show();
  }

  generateAllPaySlip(val?: any) {
    const body: any = {};
    body.userMasterID = val.user;
    body.payrollFrequency = val?.payrollFrequency;
    body.payrollFrequency = this.filterData?.payrollFrequency;
    if (this?.filterData?.payrollFrequency == 'Monthly') {
      body.month = this.selectedMonth.replace('-', '');
    } else {
      body.startDate = this.filterData?.startDate;
      body.endDate = this.filterData?.endDate;
    }

    this.spinner.start('generatePayslip');
    this.api.callApi(this.constant.GENERATEPAYSLIP, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        this.spinner.stop('generatePayslip');
        this.getEmployeePaySlipData();
        this.commonNotificationService.handleSuccess('All Pay Slip generated successfully.');
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message);
        this.spinner.stop('generatePayslip');
      },
    );
  }

  downloadPayslip() {
    const fileUrl = this.showSalarySlipData.path;
    const fileName = 'Pay Slip';

    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    });
  }

  export() {
    console.log(this.filterData.month, 'this.filterData.month');
    this.spinner.start('generatePayslip');
    this.filterData.Export = true;
    if (
      this.filterData.payrollFrequency == 'Fortnightly' ||
      this.filterData.payrollFrequency == 'Weekly'
    )
      if (this.filterData.startDate == '' || this.filterData.endDate == '') return;
    if (this.filterData.month == '' && this.filterData.payrollFrequency == 'Monthly') return;

    this.api
      .callApi(
        this.constant.GETPAYSLIPGENERATORDATA,
        this.filterData,
        'POST',
        true,
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          this.downloadFileService.handleFileDownload(res, 'Pay Slip.xlsx', 'text/xlsx');
          this.spinner.stop('generatePayslip');
          this.filterData.Export = false;
        },
        (err) => {
          this.filterData.Export = false;
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('generatePayslip');
        },
      );
  }

  selectDateRange(event: any) {
    this.startDate = null;
    this.endDate = null;

    if (event) {
      const data = this.dateRangeData.find((e) => e.title == event);

      if (data) {
        this.startDate = data.from;
        this.endDate = data.to;
      }
    }
  }
}
