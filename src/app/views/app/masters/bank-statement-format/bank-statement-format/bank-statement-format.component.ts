import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonFilterButtonFields, CommonFilterFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
    selector: 'app-bank-statement-format',
    templateUrl: './bank-statement-format.component.html',
    styleUrls: ['./bank-statement-format.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class BankStatementFormatComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  currentPage: number;

  hideFilters: CommonFilterFields[] = [
    CommonFilterFields.Status,
    CommonFilterFields.Branch,
    CommonFilterFields.Department,
    CommonFilterFields.Designation,
    CommonFilterFields.Division,
    CommonFilterFields.EmployementType,
    CommonFilterFields.Project,
    CommonFilterFields.SalaryType,
    CommonFilterFields.SkillCategory,
    CommonFilterFields.User,
    CommonFilterFields.WorkingArea
  ];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];

  permissionview: any = []
  permissionedit: any = []
  permissiondelete: any = []
  permissioncreate: any = []

  bankdata: any = []

  itemOptionsPerPage = ItemOptionsPerPageArray;

  page = {
    totalCount: 0,
    offset: 0,
  };

  filterData = {
    page: 1,
    limit: 10,
    bankMasterID: null,
    companyMasterID: null
  };

  rows: any = []

  adminRoot = environment.adminRoot;
  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private commonNotificationService: CommonNotificationService,
    private formValueStorageService: FormValueStorageService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/masters/bankStatementFormat',
          this.adminRoot + '/masters/bankStatementFormat/edit',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('BankStatementFormatComponent', false);
        }
      }
    });
  }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    if (this.formValueStorageService.isEmptyObject('BankStatementFormatComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        companyMasterID: null,
        bankMasterID: null
      };
    } else {
      this.filterData = this.formValue.BankStatementFormatComponent.body;
    }
    this.checkpermission()
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
              permissionval.formName == 'BankStatementFormat' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'BankStatementFormat' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'BankStatementFormat' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissiondelete = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'BankStatementFormat' &&
              permissionval.operationName.includes('Delete')
            );
          });

          if (this.permissionview.length > 0)
            this.getBankData();
          this.spinner.stop();
        }
      });
  }

  onLimitChange(ev: any) {
    this.filterData.limit = ev;
    this.getAllData();
  }

  getAllData() {
    this.api.callApi(this.constant.GETBANKSTATEMENTFORMAT, this.filterData, 'POST', false, true, true).subscribe(
      (res: any) => {
        this.rows = res.data;
        this.page.totalCount = res.totalcount;
        setTimeout(() => {
          this.currentPage = this.filterData.page;
        }, 100);
        this.spinner.stop();
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message)
      },
    )
  }

  getCompany(companyMasterID: number) {
    this.filterData.companyMasterID = companyMasterID;
    this.getAllData();
  }


  onSubmit(val: any) {
    this.filterData.companyMasterID = val.company;
    this.filterData.bankMasterID = val.bankMasterID;
    this.getAllData();
  }

  clear() {
    this.filterData = {
      page: 1,
      limit: 10,
      bankMasterID: null,
      companyMasterID: null
    };
    if(!this.formValueStorageService.isEmptyObject('BankStatementFormatComponent')){
      this.filterData.page = this.formValue?.BankStatementFormatComponent?.body?.page;
      this.filterData.limit = this.formValue?.BankStatementFormatComponent?.body?.limit;
    }
    this.currentPage = this.filterData.page;
  }

  onChangeBank(item) {
    this.filterData.bankMasterID = item
  }

  navigateToAddPage() {
    this.router.navigate(['/app/masters/bankStatementFormat/add'])
  }

  getBankData() {
    this.spinner.start('bankData');
    let filter = { page: '', limit: '' };
    this.api.callApi(this.constant.GETBANKDATA, filter, 'POST', false, true, true).subscribe(
      (res: any) => {
        this.bankdata = res.data;
        this.spinner.stop('bankData');
      },
      (err) => {
        this.spinner.stop('bankData');
        this.commonNotificationService.handleError(err.error.message)
      },
    );
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getAllData();
    } else {
      this.commonNotificationService.handleError("Something went wrong!")
    }
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'BankStatementFormatComponent',
      {
        companyMasterID: rowData.companyMasterID,
        bankMasterID: rowData.bankMasterID,
        page: this.filterData.page,
        limit: this.filterData.limit
      },
      '/masters/bankStatementFormat/edit',
      rowData.companyMasterID,
    );
  }

  alertConfirmation(companyMasterID: any, bankMasterID: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.start('confirm');
        this.api
          .callApi(this.constant.DELETEBANKSTATEMENTFORMAT + '?companyMasterID=' + companyMasterID + '&bankMasterID=' + bankMasterID, {}, 'DELETE', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.commonNotificationService.handleSuccess(res.message);
                this.getAllData();
                this.spinner.stop('confirm');
              } else {
                this.commonNotificationService.handleError(res.message)
                this.spinner.stop('confirm');
              }
            },
            (err) => {
              this.commonNotificationService.handleError(err.error.message)
              this.spinner.stop('confirm');
            },
          );
      }
    });
  }

}
