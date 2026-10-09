import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonFilterButtonFields, CommonFilterFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { DownloadFileService } from 'src/app/services/download-file.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CommonUtils } from 'src/app/utils/common.utils';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
    selector: 'app-list-employee-bonus',
    templateUrl: './list-employee-bonus.component.html',
    styleUrls: ['./list-employee-bonus.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListEmployeeBonusComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  hideFilters: CommonFilterFields[] = [
    CommonFilterFields.Status
  ];
  showButtons: CommonFilterButtonFields[] = [
    CommonFilterButtonFields.Submit,
    CommonFilterButtonFields.Clear,
    CommonFilterButtonFields.Cancel,
    CommonFilterButtonFields.Import
  ];
  filterData = {
    page: 1,
    limit: 10,
    companyMasterId: +localStorage.getItem('company_id'),
    userMasterID: [],
    fromMonth: '',
    toMonth: '',
    Export: false,
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

  constructor(private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private commonNotificationService: CommonNotificationService,
    private downloadFileService: DownloadFileService,
  ) {
  }

  ngOnInit(): void {
    this.checkpermission();
  }

  getEmployeeBonusData() {
    this.spinner.start('main');
    this.api
      .callApi(this.constant.LISTEMPLOYEEBONUS, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.employeeBonusData = res.data;
            this.employeeBonusData = this.employeeBonusData.map((item) => ({
              ...item,
              formattedBonusYYYYMM: CommonUtils.getFormattedMonth(item.bonusYYYYMM),
              formattedPayYYYYMM: item.payYYYYMM ? CommonUtils.getFormattedMonth(item.payYYYYMM) : '',
            }));
            this.init = false;

            if (this.employeeBonusData.length > 0) {
              this.showButtons.push(CommonFilterButtonFields.Excel)
            } else {
              this.showButtons = [
                CommonFilterButtonFields.Submit,
                CommonFilterButtonFields.Clear,
                CommonFilterButtonFields.Cancel,
                CommonFilterButtonFields.Import
              ];
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
      this.filterData.companyMasterId = val.company;
      this.filterData.userMasterID = val.user;
      this.filterData.fromMonth = this.selectedFromMonth.replace('-', '')
      this.filterData.toMonth = this.selectedToMonth.replace('-', '')
      this.filterData.Export = false;
      this.getEmployeeBonusData();
    }

  }


  getCompany(val?: any) {
    this.filterData.companyMasterId = val;
    if (this.init) {
      this.getEmployeeBonusData();
    }
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

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getEmployeeBonusData();
    } else {
      this.commonNotificationService.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.getEmployeeBonusData();
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
                this.commonNotificationService.handleSuccess(res.message)
                this.getEmployeeBonusData();
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

  download() {
    this.filterData.Export = true;
    this.spinner.start('start');
    this.api
      .callApi(this.constant.LISTEMPLOYEEBONUS, this.filterData, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => {
          this.downloadFileService.handleFileDownload(res, 'Employee Bonus.xlsx', 'text/xlsx')
          this.spinner.stop('start');
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
  }

  clear() {
    this.filterData = {
      page: 1,
      limit: 10,
      companyMasterId: +localStorage.getItem('company_id'),
      userMasterID: [],
      fromMonth: '',
      toMonth: '',
      Export: false,
    }
    this.employeeBonusData = [];
    this.showButtons = [
      CommonFilterButtonFields.Submit,
      CommonFilterButtonFields.Clear,
      CommonFilterButtonFields.Cancel,
      CommonFilterButtonFields.Import
    ];

    this.selectedFromMonth = '';
    this.selectedToMonth = ''

    this.getEmployeeBonusData();
  }

  importExcel() {
    this.router.navigate([this.adminRoot + '/payrolls/employee_bonus/import_employee_bonus']);
  }
}
