import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { DownloadFileService } from 'src/app/services/download-file.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { environment } from 'src/environments/environment';
import { ViewOfficeExpenseCommonComponent } from '../../view-office-expense-common/view-office-expense-common.component';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
    selector: 'app-list-office-exp-request',
    templateUrl: './list-office-exp-request.component.html',
    styleUrls: ['./list-office-exp-request.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListOfficeExpRequestComponent implements OnInit {

  @ViewChild('listOfcExpRequest') listOfcExpRequest: NgForm;
  @ViewChild(ViewOfficeExpenseCommonComponent) viewOfficeExpenseCommonComponent: ViewOfficeExpenseCommonComponent;
    @ViewChild(DatatableComponent) table: DatatableComponent;

  permissioncreate: any = []
  permissionview: any = []
  permissionedit: any = []
  permissiondelete: any = []

  adminRoot = environment.adminRoot;
  itemOptionsPerPage = ItemOptionsPerPageArray

  filterData = {
    branchMasterID: null,
    siteID: null,
    fromDate: '',
    toDate: '',
    page: 1,
    limit: 10
  }

  page = {
    offset: 0,
    totalCount: 0
  }

  officeExpenseCalculations: any;
  currentPage: any;

  rows: any = [];
  allSites: any = [];
  allBranch: any = [];

  row: any;
  showOfficeExpenseData: boolean = false;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private formValueStorageService: FormValueStorageService,
    private commonNotificationService: CommonNotificationService,
    private downloadFileService: DownloadFileService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/finances/officeExpense',
          this.adminRoot + '/finances/officeExpense/edit',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('commonFilterData', true);
          formValueStorageService.removeData('ListOfficeExpenseComponent', true);
        }
      }
    });
  }

  ngOnInit(): void {
    this.checkpermission();
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
          this.permissiondelete = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'OfficeExpenseRequest' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'OfficeExpenseRequest' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'OfficeExpenseRequest' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();

          if(this.permissionview.length > 0){
            this.getAllOfficeExpense()
            this.getAllAllocatedBranches();
            this.getAllAllocatedSites();
          }
        }
      });
  }


  getAllOfficeExpense() {
      const body: any = {
        page: this.filterData.page,
        limit: this.filterData.limit,
      }
  
      if(this.filterData.siteID != '' && this.filterData.siteID && this.filterData.siteID != null){
        body.siteID = this.filterData.siteID
      }else{
        body.branchMasterID = this.filterData.branchMasterID
      }
  
      this.spinner.start('GETALLOFFICEEXPENSE');
      this.api
        .callApi(this.constant.GETALLOFFICEEXPENSEREQUEST, this.filterData, 'POST', true, false, true)
        .subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.rows = res.data;
              // this.officeExpenseCalculations = res.officeExpenseCalculations;
              this.page.totalCount = res.totalcount
              setTimeout(() => {
                this.currentPage = this.filterData.page
              });
              this.spinner.stop('GETALLOFFICEEXPENSE');
            } else {
              this.commonNotificationService.handleError(res.message);
              this.spinner.stop('GETALLOFFICEEXPENSE');
            }
          },
          (err) => {
            this.commonNotificationService.handleError(err.error.message);
            this.spinner.stop('GETALLOFFICEEXPENSE');
          },
        );
    }

  getAllAllocatedBranches() {
    const body = {
      userMasterID: +localStorage.getItem('id'),
      companyMasterID: +localStorage.getItem('company_id')
    }
    this.spinner.start('GETALLOFFICEEXPENSEALLOCATIONRIGHTS');
    this.api.callApi(this.constant.GETALLASSIGNEDBRANCHBYUSER, body, 'POST', false, true, true).subscribe(
      (res: any) => {
        this.allBranch = res.data;
        this.spinner.stop('GETALLOFFICEEXPENSEALLOCATIONRIGHTS');
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message)
      },
    )
  }

  getAllAllocatedSites() {
    const body = {
      userMasterID: +localStorage.getItem('id'),
    }
    this.spinner.start('GETALLOFFICEEXPENSEALLOCATIONRIGHTS');
    this.api.callApi(this.constant.GETALLASSIGNEDSITEBYUSER, body, 'POST', false, true, true).subscribe(
      (res: any) => {
        this.allSites = res.data;
        this.spinner.stop('GETALLOFFICEEXPENSEALLOCATIONRIGHTS');
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message)
      },
    )
  }

  onSelectBranch(branchMasterID: any) {
    this.filterData.branchMasterID = branchMasterID
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.getAllOfficeExpense();
    } else {
      this.commonNotificationService.handleError('Something Went Wrong!');
    }
  }
  
  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getAllOfficeExpense();
    } else {
      this.commonNotificationService.handleError('Something Went Wrong!');
    }
  }

  onSubmit(){

  }

  onModalClose() {
    this.showOfficeExpenseData = false;
    this.row = null;
  }

  showExpenseData(row: any) {
    this.showOfficeExpenseData = true;
    this.row = row;
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListOfficeExpenseComponent',
      {
        ...this.filterData,
        navigatedFrom: 'ListOfficeExpRequestComponent'
      },
      '/finances/officeExpense/edit',
      rowData.officeExpenseID,
    );
  }
}
