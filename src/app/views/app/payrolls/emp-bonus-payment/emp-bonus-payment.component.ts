import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { AppNotificationService } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonFilterButtonFields, CommonFilterFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { DownloadFileService } from 'src/app/services/download-file.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CommonUtils } from 'src/app/utils/common.utils';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { saveAs } from 'file-saver';
import { paymentMode } from 'src/app/constants/commonVariables';
import { NgForm } from '@angular/forms';
import { userInfo } from 'os';
import { months } from 'moment';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-emp-bonus-payment',
    templateUrl: './emp-bonus-payment.component.html',
    styleUrls: ['./emp-bonus-payment.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EmpBonusPaymentComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('bonusForm') bonusForm!: NgForm;
  @ViewChild('lgModal', { static: false }) lgModal: ModalDirective;

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
  columnMode: ColumnMode.force
  commonFilterData: any

  permissionview: any = [];
  rows: any = [];

  filterData = {
    page: 1, 
    limit: 10,
    companyMasterID: null,
    userMasterID: [],
    Export: false,
    month: ''
  };
  adminRoot = environment.adminRoot;
  amountToPay: number = 0;
  currentMonth: string;
  maxMonth: string = '';

  public paymentModes = paymentMode;
  paymentMode: any;
  employeeBonusIds: any = []

  page = {
    totalCount: 0,
    offset: 0,
  }

  rowData = {
    userMasterID: null,
    month: '',
    payYYYYMM: '',
    referenceNO: '',
    paymentMode: '',
  }

  formValue: any

  currentPage: number = 1

  itemOptionsPerPage = ItemOptionsPerPageArray;
  permissionedit: any;

  constructor(
      private spinner: NgxUiLoaderService,
      private api: ApiService,
      private constant: ConstantService,
      private formValueStorageService: FormValueStorageService,
      private commonNotificationService: CommonNotificationService,
      private downloadFileService: DownloadFileService,
      private router: Router,
    ) {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          const protectedRoutes = [
            this.adminRoot + '/payrolls/empBonusPayment',
            this.adminRoot + '/payrolls/empBonusPayment/view',
          ];
  
          const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
          if (!isProtectedRoute) {
            formValueStorageService.removeData('EmpBonusPaymentComponent', false);
            formValueStorageService.removeData('commonFilterData', true);
          }
        }
      });
    }

  ngOnInit(): void {
    this.currentMonth = new Date().toISOString().slice(0, 7);
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = String(today.getMonth() + 1).padStart(2, '0'); // Ensures 2-digit month format
    this.maxMonth = `${currentYear}-${currentMonth}`;
    this.checkpermission()
  }

  clear(){
    this.commonFilterData = null;
    this.formValue = this.formValueStorageService.getData()
    this.currentMonth = new Date().toISOString().slice(0, 7);
    this.filterData = {
      page: this.formValue.EmpBonusPaymentComponent?.body?.page ? this.formValue.EmpBonusPaymentComponent?.body?.page : 1,
      limit: this.formValue.EmpBonusPaymentComponent?.body?.limit ? this.formValue.EmpBonusPaymentComponent?.body?.limit : 10,
      companyMasterID: null,
      userMasterID: [],
      Export: false,
      month: this.currentMonth?.replace('-','')
    };

    this.rows = [];

    this.showButtons = [
      CommonFilterButtonFields.Submit,
      CommonFilterButtonFields.Clear,
    ];

    this.formValueStorageService.removeComponentData('EmpBonusPaymentComponent', true);
  }

  onSubmit(val: any){
    this.commonFilterData = val;
    this.filterData.companyMasterID = val?.company;
    this.filterData.userMasterID = val?.user;
    this.filterData.month = val?.monthYear.replace("-", "");
    this.getEmployeeBonusData();
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.getEmployeeBonusData()
    }
  }

  getEmployeeBonusData(){
    this.filterData.Export = false;
    this.spinner.start('employeeBonus');
    this.api
      .callApi(this.constant.LISTEMPLOYEEBONUSPAYMENT, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;

            if (this.rows.length > 0) {
              this.showButtons.push(CommonFilterButtonFields.Excel)
            } else {
              this.showButtons = [
                CommonFilterButtonFields.Submit,
                CommonFilterButtonFields.Clear,
                CommonFilterButtonFields.Cancel,
              ];
            }

            this.page.totalCount = res.totalcount;
            setTimeout(() => {
              this.currentPage = this.filterData.page;
            }, 100);
            this.spinner.stop('employeeBonus');
          } else {
            this.commonNotificationService.handleError(res.message)
            this.spinner.stop('employeeBonus');
          }
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message)
          this.spinner.stop('employeeBonus');
        },
      );
  }

  navigateToViewPage(data: any){
    if (this.commonFilterData && this.commonFilterData != null && Object.keys(this.commonFilterData).length > 0)
      this.formValueStorageService.addData(
        'commonFilterData',
        this.commonFilterData
      );
    this.formValueStorageService.navigate(
      'EmpBonusPaymentComponent',
      this.filterData,
      '/payrolls/empBonusPayment/view',
      data.userMasterID,
    );
  }

  getCompany(companyMasterID: any){
    this.filterData.companyMasterID = companyMasterID;
    this.filterData.month = this.currentMonth.replace("-", "");
    setTimeout(() => {
      this.getEmployeeBonusData();
    });
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
              permissionval.formName == 'EmployeeBonusPayment' &&
              permissionval.operationName.includes('View')
            );
          });

          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'EmployeeBonusPayment' &&
              permissionval.operationName.includes('Edit')
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
      this.commonNotificationService.handleError('Something went wrong!')
    }
  }

  onPageChange(data){
    this.filterData.page = data.page;
    this.filterData.limit = data.itemsPerPage;
    this.getEmployeeBonusData();
  }
  download() {
    this.filterData.Export = true;

    this.spinner.start('start');
    this.api
      .callApi(this.constant.LISTEMPLOYEEBONUSPAYMENT, this.filterData, 'POST', true, false, true, true)
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

  pay(row: any){
    this.rowData.userMasterID = row.userMasterID;
    this.rowData.month = row.month;
    this.amountToPay = row["Pending Bonus"];
  }

  submitPayment(){
    this.rowData.payYYYYMM = this.bonusForm.value.payYYYYMM.replace("-", "");
    this.rowData.paymentMode = this.paymentMode;
    this.rowData.referenceNO  = this.bonusForm.value.referenceNO;
    this.spinner.start('pendingBonusData');
    this.api
      .callApi(this.constant.PAYEMPLOYEEBONUS, this.rowData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.commonNotificationService.handleSuccess(res.message)
            this.spinner.stop('pendingBonusData');
            this.getEmployeeBonusData();
            this.lgModal.hide()
            this.rowData = {
              userMasterID: null,
              month: '',
              payYYYYMM: '',
              referenceNO: '',
              paymentMode: '',
            }
            this.amountToPay = 0
            this.bonusForm.resetForm();
          } else {
            this.commonNotificationService.handleError(res.message)
            this.spinner.stop('pendingBonusData');
          }
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message)
          this.spinner.stop('pendingBonusData');
        },
      );
  }
}
