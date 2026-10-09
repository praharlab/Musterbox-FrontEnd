import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { DownloadFileService } from 'src/app/services/download-file.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
    selector: 'app-list-allocate-ofc-expense-rights',
    templateUrl: './list-allocate-ofc-expense-rights.component.html',
    styleUrls: ['./list-allocate-ofc-expense-rights.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListAllocateOfcExpenseRightsComponent implements OnInit {

  @ViewChild('listAllocationForm') listAllocationForm: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  userMasterID: number
  currentPage: number;

  permissionview: any = []
  permissionedit: any = []
  permissiondelete: any = []
  permissioncreate: any = []
  
  company: any = []
  allbranch: any = []
  allSites: any = []

  itemOptionsPerPage = ItemOptionsPerPageArray;

  page = {
    totalCount: 0,
    offset: 0,
  };

  filterData = {
    page: 1,
    limit: 10,
    branchMasterID: null,
    siteID: null,
    exportData: false,
    companyMasterID: null
  };

  showExportButton: boolean = false;

  rows: any = []

  adminRoot = environment.adminRoot;
  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private api: ApiService,
    private constant: ConstantService,
    private commonNotificationService: CommonNotificationService,
    private formValueStorageService: FormValueStorageService,
    private downloadFileService: DownloadFileService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/finances/allocateOfcExpRights',
          this.adminRoot + '/finances/allocateOfcExpRights/edit',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListAllocateOfcExpenseRightsComponent', true);
        }
      }
    });
  }

  ngOnInit(): void {
    this.userMasterID = +localStorage.getItem('id');
    this.formValue = this.formValueStorageService.getData();
    this.getcompany();
    this.checkpermission()
    if (this.formValueStorageService.isEmptyObject('ListAllocateOfcExpenseRightsComponent')) {
      this.filterData = {
        companyMasterID: +localStorage.getItem('company_id'),
        page: 1,
        limit: 10,
        branchMasterID: null,
        siteID: null,
        exportData: false
      };
    } else {
      this.filterData = this.formValue?.ListAllocateOfcExpenseRightsComponent?.body;
    }

    this.formValueStorageService.removeComponentData('ListAllocateOfcExpenseRightsComponent', true);
  }
  
  checkpermission() {
    this.spinner.start();
    let body = {
      userMasterID: this.userMasterID,
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          let permission = res.data;
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AllocateOfficeExpenseRights' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AllocateOfficeExpenseRights' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AllocateOfficeExpenseRights' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissiondelete = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AllocateOfficeExpenseRights' &&
              permissionval.operationName.includes('Delete')
            );
          });

          this.spinner.stop();
        }
      });
  }

  onLimitChange(ev: any) {
    this.filterData.limit = ev;
    this.getAllData();
  }

  getAllData() {
    this.spinner.start('AllocateOfficeExpenseRights');
    this.api.callApi(this.constant.GETALLOFFICEEXPENSEALLOCATIONRIGHTS, this.filterData, 'POST', false, true, true, this.filterData.exportData).subscribe(
      (res: any) => {
        if (res.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          this.downloadFileService.handleFileDownload(
            res,
            'AllocateOfficeExpenseRights.xlsx',
            'text/xlsx',
          );
          this.filterData.exportData = false;
          this.spinner.stop('OfficeExpenseCategories');
        } else {
          this.rows = res.data;
          if (this.rows.length > 0) {
            this.showExportButton = true;
          } else {
            this.showExportButton = false;
          }
          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.filterData.page;
          }, 100);
        }
        this.spinner.stop('AllocateOfficeExpenseRights');
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message)
      },
    )
  }

  onSubmit() {
    this.filterData.siteID = this.listAllocationForm.value.site;
    this.filterData.companyMasterID = this.listAllocationForm.value.companyMasterID;
    this.filterData.branchMasterID = this.listAllocationForm.value.branch;
    this.getAllData();
  }

  navigateToAddPage() {
    this.router.navigate(['/app/finances/allocateOfcExpRights/add'])
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListAllocateOfcExpenseRightsComponent',
      {
        allocateOfficeExpenseRightsID: rowData.allocateOfficeExpenseRightsID,
        ...this.filterData
      },
      '/finances/allocateOfcExpRights/edit',
      rowData.allocateOfficeExpenseRightsID,
    );
  }

  alertConfirmation(allocateOfficeExpenseRightsID: any) {
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
          .callApi(this.constant.DELETEOFFICEEXPENSEALLOCATIONRIGHTS + allocateOfficeExpenseRightsID, {}, 'DELETE', true, true, true)
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

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getAllData();
    } else {
      this.commonNotificationService.handleError('Something Went Wrong!')
    }
  }

  export() {
    this.filterData.exportData = true;
    this.getAllData()
  }

  getcompany() {
    const body = {
      companyMasterID: +localStorage.getItem('company_id'),
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.company = res.data;
          this.selectCompany(this.filterData.companyMasterID);
          this.spinner.stop();
        }
      });
  }

  selectCompany(companyMasteID: number) {
    this.filterData.companyMasterID = companyMasteID
    this.getAllBranches(companyMasteID);
    this.getAllData()
  }

  getAllBranches(companyMasterID: number) {
    this.spinner.start('getAllbranches');
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + companyMasterID, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;
        this.spinner.stop('getAllbranches');
      });
  }

  selectBranch(branchMasterID: number){
    this.getAllSites(branchMasterID);
  }

  getAllSites(branchMasterID: number) {
    this.spinner.start('getAllSites');
    this.api
      .callApi(this.constant.LISTSITE, { branchMasterID, companyMasterID: this.filterData.companyMasterID }, 'POST', true, false, true)
      .subscribe((res: any) => {
        this.allSites = res.data;
        this.spinner.stop('getAllSites');
      });
  }

  clear(){
    this.listAllocationForm.resetForm();
    this.formValueStorageService.removeComponentData('ListAllocateOfcExpenseRightsComponent', true);
    this.rows = [];
    this.filterData = {
      page: 1,
      limit: 10,
      branchMasterID: null,
      siteID: null,
      exportData: false,
      companyMasterID: +localStorage.getItem('company_id')
    };
    this.selectCompany(this.filterData.companyMasterID);
  }

}
