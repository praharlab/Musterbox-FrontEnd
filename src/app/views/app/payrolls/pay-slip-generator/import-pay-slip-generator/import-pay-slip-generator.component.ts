import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonFilterButtonFields, CommonFilterFields, CommonRequiredFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { DownloadFileService } from 'src/app/services/download-file.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { labelUtils } from 'src/app/constants/labelUtils';
import { NgForm } from '@angular/forms';
import { CommonFilterComponent } from '../../../common-filter/common-filter.component';

@Component({
    selector: 'app-import-pay-slip-generator',
    templateUrl: './import-pay-slip-generator.component.html',
    styleUrls: ['./import-pay-slip-generator.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ImportPaySlipGeneratorComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('tableForm') tableForm: NgForm;

  hideFilters: CommonFilterFields[] = [
    CommonFilterFields.Status,
    CommonFilterFields.Designation,
    CommonFilterFields.Division,
    CommonFilterFields.EmployementType,
    CommonFilterFields.Project,
    CommonFilterFields.SalaryType,
    CommonFilterFields.SkillCategory,
    CommonFilterFields.WorkingArea,
  ];
  showButtons: CommonFilterButtonFields[] = [
    CommonFilterButtonFields.Submit,
    CommonFilterButtonFields.Cancel
  ];

  @ViewChild(CommonFilterComponent) commonFilterComponent: CommonFilterComponent;

  showRequiredFields: CommonRequiredFields[] = [
    CommonRequiredFields.Company
  ]

  filterData = {
    companyMasterID: +localStorage.getItem('company_id'),
    branchMasterID: "",
    departmentID: "",
    userMasterID: [],
    payrollFrequency: "Monthly",
    month: "",
    startDate: "",
    endDate: ""


  }

  permissionedit: any = [];
  permissionview: any = [];
  permissioncreate: any = [];
  adminRoot = environment.adminRoot;
  employeeBonusData: any = [];
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
  selectedYear: number
  file: any;
  fileName: any;
  rows: any[] = [];
  isValidated: boolean;
  selectedDateRange: string = ''
  selectedMonth: any
  downloadDemoExcel: boolean = false;
  selectedCompany: number
  selectedBranch: any;
  selectedDepartment: any;
  selectedUsers: any = [];
  startDate: any = '';
  endDate: any = '';
  remarksCount: number;
  finalHeader: any = [];
  isEdited: boolean = false;

  constructor(private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private commonNotificationService: CommonNotificationService,
    private downloadFileService: DownloadFileService,
  ) {
  }

  ngOnInit(): void {
    this.checkpermission();
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 2000; i--) {
      this.years.push(i);
    }
  }

  getDateRange() {
    this.selectedDateRange = '';

    this.dateRangeData = [];

    if (!this.selectedYear || !['Fortnightly', 'Weekly'].includes(this.selectedPayrollFrequencyType)) return;

    const body = {
      year: this.selectedYear,
      payrollFrequency: this.selectedPayrollFrequencyType
    }

    this.spinner.start('getDate');
    this.api
      .callApi(this.constant.GETDATERANGE, body, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.dateRangeData = res.data;
            this.dateRangeData = this.dateRangeData.map((item) => ({
              ...item,
              value: `${item.title}(${item.from} - ${item.to})`
            }));

          }
          this.spinner.stop('getDate');
        },
        (err) => {
          this.spinner.stop('getDate');

        },
      );
  }

  changePayrollFrequency() {
    this.selectedDateRange = '';
    if (this.selectedPayrollFrequencyType == 'Monthly') {
      this.selectedYear = null;
    } else {
      this.selectedMonth = null
    }

  }

  downloadDemoExcelShow() {
    this.downloadDemoExcel = false;
    if (this.selectedCompany && this.selectedPayrollFrequencyType) {
      if (this.selectedPayrollFrequencyType == 'Monthly' && this.selectedMonth) this.downloadDemoExcel = true;
      if (['Fortnightly', 'Weekly'].includes(this.selectedPayrollFrequencyType) && this.selectedYear && this.selectedDateRange) this.downloadDemoExcel = true;
    }
  }

  getEmployeeBonusData() {
    // this.spinner.start('main');
    // this.api
    //   .callApi(this.constant.LISTEMPLOYEEBONUS, this.filterData, 'POST', true, false, true)
    //   .subscribe(
    //     (res: any) => {
    //       if (res.status == 200) {
    //         this.employeeBonusData = res.data;
    //         this.employeeBonusData = this.employeeBonusData.map((item) => ({
    //           ...item,
    //           formattedBonusYYYYMM: CommonUtils.getFormattedMonth(item.bonusYYYYMM),
    //           formattedPayYYYYMM: item.payYYYYMM ? CommonUtils.getFormattedMonth(item.payYYYYMM) : '',
    //         }));
    //         this.init = false;

    //         if (this.employeeBonusData.length > 0) {
    //           this.showButtons.push(CommonFilterButtonFields.Excel)
    //         } else {
    //           this.showButtons = [
    //             CommonFilterButtonFields.Submit,
    //             CommonFilterButtonFields.Clear,
    //             CommonFilterButtonFields.Cancel,
    //           ];
    //         }
    //         this.page.totalCount = res.totalcount;
    //         setTimeout(() => {
    //           this.currentPage = this.filterData.page;
    //           this.itemsPerPage = this.filterData.limit;
    //         }, 100);
    //         this.spinner.stop('main');
    //       } else {
    //         this.spinner.stop('main');
    //         this.commonNotificationService.handleError(res.message);
    //       }
    //     },
    //     (err) => {
    //       this.spinner.stop('main');
    //       this.commonNotificationService.handleError(err.error.message);
    //     },
    //   );
  }

  onSubmit(val?: any) {
    if (val) {
      this.filterData.companyMasterID = val.company;
      this.filterData.branchMasterID = val.branch;
      this.filterData.departmentID = val.department;
      this.filterData.userMasterID = val.user || [];
      this.filterData.payrollFrequency = this.selectedPayrollFrequencyType;
      this.filterData.month = this.selectedPayrollFrequencyType == 'Monthly' ? this.selectedMonth.replace('-', '') : null;
      this.filterData.startDate = ['Fortnightly', 'Weekly'].includes(this.selectedPayrollFrequencyType) ? this.startDate : null;
      this.filterData.endDate = ['Fortnightly', 'Weekly'].includes(this.selectedPayrollFrequencyType) ? this.endDate : null;

      this.getEmployeeBonusData();
    }

  }


  getCompany(val?: any) {
    this.selectedCompany = val;
    this.downloadDemoExcelShow();
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

          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'EmployeeBonus' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'EmployeeBonus' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'EmployeeBonus' &&
              permissionval.operationName.includes('Create')
            );
          });

          this.spinner.stop('permission');
        }
      });
  }

  onFileChange(event: any) {
    this.file = event.target.files && event.target.files[0];
    this.fileName = this.file.name;
    this.rows = [];
    this.isValidated = false;
    event.target.value = '';
  }

  getAllUsers(val: any) {
    this.selectedCompany = null;
    this.selectedBranch = null;
    this.selectedDepartment = null;

    if (val) {
      this.selectedCompany = val.companyMasterID;
      this.selectedBranch = val.branchMasterID;
      this.selectedDepartment = val.departmentID;

    }

  }

  getUsers(val: any) {
    this.selectedUsers = [];
    if (val) {
      this.selectedUsers = val
    }
  }

  selectDateRange(event: any) {
    this.startDate = null;
    this.endDate = null;

    if (event) {
      const data = this.dateRangeData.find(e => e.title == event);

      if (data) {
        this.startDate = data.from;
        this.endDate = data.to;
      }

    }
  }


  download() {

    this.filterData.companyMasterID = this.selectedCompany;
    this.filterData.branchMasterID = this.selectedBranch;
    this.filterData.departmentID = this.selectedDepartment;
    this.filterData.userMasterID = this.selectedUsers || [];
    this.filterData.payrollFrequency = this.selectedPayrollFrequencyType;
    this.filterData.month = this.selectedPayrollFrequencyType == 'Monthly' ? this.selectedMonth.replace('-', '') : null;
    this.filterData.startDate = ['Fortnightly', 'Weekly'].includes(this.selectedPayrollFrequencyType) ? this.startDate : null;
    this.filterData.endDate = ['Fortnightly', 'Weekly'].includes(this.selectedPayrollFrequencyType) ? this.endDate : null;

    console.log(this.filterData, 'fiulterdata');

    this.spinner.start('start');
    this.api
      .callApi(this.constant.DEMOEXCELFORPAYSLIPGENERATOR, this.filterData, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => {
          this.downloadFileService.handleFileDownload(res, `PaySlip Generator Demo ${this.filterData.month ? this.filterData.month : (this.filterData.startDate + ' - ' + this.filterData.endDate)}.xlsx`, 'text/xlsx')
          this.spinner.stop('start');
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
  }


  validateData(val?: any) {

    if (this.file && val) {
      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('companyMasterID', val.company);
      formData.append('branchMasterID', val.branch || '');
      formData.append('departmentID', val.department || '');

      const userIds = val.user || [];

      userIds.forEach(element => {
        formData.append('userMasterID[]', element);
      });

      formData.append('payrollFrequency', this.selectedPayrollFrequencyType);
      formData.append('month', this.selectedPayrollFrequencyType == 'Monthly' ? this.selectedMonth.replace('-', '') : '');
      formData.append('startDate', ['Fortnightly', 'Weekly'].includes(this.selectedPayrollFrequencyType) ? this.startDate : '');
      formData.append('endDate', ['Fortnightly', 'Weekly'].includes(this.selectedPayrollFrequencyType) ? this.endDate : '');

      this.spinner.start('validate');
      this.api
        .callApi(this.constant.VALIDATEPAYSLIPGENERATOREXCEL, formData, 'POST', true, true, true)
        .subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.rows = res.data;
              this.finalHeader = res.finalHeader;
              this.rows = this.rows.map((item) => ({
                ...item,
                isDeleted: false
              }));
              this.remarksCount = this.rows.filter(
                (item: any) => item.remarks
              ).length;

              this.commonNotificationService.handleSuccess(res.message);
              this.isValidated = true;
              this.file = {};
              this.spinner.stop('validate');
            } else {
              this.file = {};
              this.commonNotificationService.handleError(res.message);
              this.spinner.stop('validate');
            }
            this.fileName = ''
          },
          (err) => {
            this.file = {};
            this.fileName = ''
            this.commonNotificationService.handleError(err.error.message);
            this.spinner.stop('validate');
          },
        );
    }
  }

  reValidateData() {
    if (!this.tableForm.valid) {
      return;
    }
    const negativeAmountIndexes = this.rows.reduce((acc, e, index) => {
      if (e.amount < 0) acc.push(index + 1);
      return acc;
    }, []);
    if (negativeAmountIndexes.length) {
      return this.commonNotificationService.handleWarning(`Value cannot be negative at row ${negativeAmountIndexes.join(', ')}`);
    }
    this.spinner.start('revalidate');
    let body = {
      paySlipData: this.rows,
      finalHeader: this.finalHeader || [],
      companyMasterID: this.selectedCompany,
    };
    this.api
      .callApi(this.constant.REVALIDATEPAYSLIPGENERATOREXCEL, body, 'POST', false, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.rows = this.rows.map((item) => ({
              ...item,
              isDeleted: false
            }));
            this.remarksCount = this.rows.filter(
              (item: any) => item.remarks != '' && item.remarks,
            ).length;

            if (this.remarksCount > 0) {
              this.isEdited = true;
            } else {
              this.isEdited = false;
            }
            this.commonNotificationService.handleSuccess(res.message)
            this.spinner.stop('revalidate');
          } else {
            this.commonNotificationService.handleError(res.message);
            this.spinner.stop('revalidate');
          }
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('revalidate');
        },
      );
  }

  saveData() {
    if (!this.tableForm.valid) {
      return;
    }

    const negativeAmountIndexes = this.rows.reduce((acc, e, index) => {
      if (e.amount < 0) acc.push(index + 1);
      return acc;
    }, []);
    if (negativeAmountIndexes.length) {
      return this.commonNotificationService.handleWarning(`Value cannot be negative at row ${negativeAmountIndexes.join(', ')}`);
    }

    this.spinner.start('saveData');
    const body = {
      paySlipData: this.rows,
      finalHeader: this.finalHeader || [],
      companyMasterID: this.selectedCompany,
    };
    this.api
      .callApi(this.constant.SAVEPAYSLIPGENERATOREXCEL, body, 'POST', false, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.commonNotificationService.handleSuccess(res.message);
            this.rows = [];
            this.fileName = '';
            this.file = {};
            this.isValidated = false;
            this.selectedDateRange = '',
              this.selectedMonth = '',
              this.selectedYear = null
            setTimeout(() => {
              this.commonFilterComponent.clear(true)
              this.spinner.stop('saveData');
            }, 3000);
          } else {
            this.fileName = '';
            this.commonNotificationService.handleError(res.message);
            this.spinner.stop('saveData');
          }
        },
        (err) => {
          this.fileName = '';
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('saveData');
        },
      );
  }

  onAmountChange(data, header, i) {
    this.isEdited = true
    if (data[`${header}`] < 0) {
      this.rows[i][`${header}`] = 0;
      return this.commonNotificationService.handleWarning(`Value cannot be negative at row ${i + 1}`);
    } else {
      this.rows[i][`${header}`] = data[`${header}`];
    }


    console.log(this.rows, ' this.rows');

  }

  removeRow(index: number) {
    this.isEdited = true;
    this.rows[index].isDeleted = true
    this.rows = this.rows.filter((row) => row.isDeleted == false)
  }

}
