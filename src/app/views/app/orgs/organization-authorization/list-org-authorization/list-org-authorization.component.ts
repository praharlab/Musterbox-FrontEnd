import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonFilterButtonFields, CommonFilterFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { DownloadFileService } from 'src/app/services/download-file.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
    selector: 'app-list-org-authorization',
    templateUrl: './list-org-authorization.component.html',
    styleUrls: ['./list-org-authorization.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListOrgAuthorizationComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;

  hideFilters: CommonFilterFields[] = [
    CommonFilterFields.Status,
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

  adminRoot = environment.adminRoot;
  permissioncreate: any = []
  permissionview: any = []
  permissionedit: any = []
  permissiondelete: any = []

  commonFilterData: any

  rows: any = [];
  allSites: any = [];
  currentPage: any
  page = {
    totalCount: 0,
    offset: 0
  }
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: null,
    branchMasterID: null,
    siteID: null,
    orgAuthorizationTypeID: null,
    exportData: false
  }
  itemOptionsPerPage = ItemOptionsPerPageArray;
  formValue: any

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
          this.adminRoot + '/orgs/orgAuthorization',
          this.adminRoot + '/orgs/orgAuthorization/edit',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('commonFilterData', true);
          formValueStorageService.removeData('ListOrgAuthorizationComponent', true);
        }
      }
    });
  }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
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
          this.permissiondelete = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'OrganizationAuthorization' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'OrganizationAuthorization' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'OrganizationAuthorization' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'OrganizationAuthorization' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  getAllOrgAuthorization() {
    this.spinner.start('GETORGANIZATIONAUTHORIZATION');
    this.api
      .callApi(this.constant.GETORGANIZATIONAUTHORIZATION, this.filterData, 'POST', true, false, true, this.filterData.exportData)
      .subscribe(
        (res: any) => {
          if (res.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            this.filterData.exportData = false;
            this.downloadFileService.handleFileDownload(res, 'OrganizationAuthorization.xlsx', 'text/xlsx');
            this.spinner.stop('GETORGANIZATIONAUTHORIZATION');
          } else {
            if (res.status == 200) {
              this.rows = res.data;
              if (this.rows.length > 0) {
                this.showButtons.push(CommonFilterButtonFields.Excel);
              } else {
                this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
              }
              this.page.totalCount = res.totalcount;
              setTimeout(() => {
                this.currentPage = this.filterData.page
              });
              this.spinner.stop('GETORGANIZATIONAUTHORIZATION');
            } else {
              this.commonNotificationService.handleError(res.message);
              this.spinner.stop('GETORGANIZATIONAUTHORIZATION');
            }
          }
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('GETORGANIZATIONAUTHORIZATION');
        },
      );
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.getAllOrgAuthorization();
    } else {
      this.commonNotificationService.handleError('Something Went Wrong!');
    }
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getAllOrgAuthorization();
    } else {
      this.commonNotificationService.handleError('Something Went Wrong!');
    }
  }

  onSubmit(val: any) {
    this.commonFilterData = val;
    this.filterData.companyMasterID = val?.company;
    this.filterData.branchMasterID = val?.branch && val?.branch.length > 0 ? val.branch : null;
    this.filterData.orgAuthorizationTypeID = val?.orgAuthorizationTypeID;
    this.filterData.siteID = val?.site;

    this.getAllOrgAuthorization();
  }

  export() {
    this.filterData.exportData = true;
    this.getAllOrgAuthorization();
  }

  getCompany(companyMasterID: number) {
    this.filterData.companyMasterID = companyMasterID;
    this.getAllOrgAuthorization();
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/orgs/orgAuthorization/add']);
  }

  navigateToEditPage(rowData: any): void {
    if (this.commonFilterData && this.commonFilterData != null && Object.keys(this.commonFilterData).length > 0)
      this.formValueStorageService.addData(
        'commonFilterData',
        this.commonFilterData
      );
    this.formValueStorageService.navigate(
      'ListOrgAuthorizationComponent',
      this.filterData,
      '/orgs/orgAuthorization/edit',
      rowData.organizationAuthorizationID,
    );
  }

  alertConfirmation(row: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body: any = {
          organizationAuthorizationID: row.organizationAuthorizationID
        }
        if(row.siteID){
          body.siteID = row.siteID
        }else{
          body.branchMasterID = row.branchMasterID
        }
        this.spinner.start('active');
        this.api.callApi(this.constant.DELETEORGANIZATIONAUTHORIZATIONYID, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            this.commonNotificationService.handleSuccess(res.message)
            this.getAllOrgAuthorization();
            this.spinner.stop('active');
          },
          (err) => {
            this.commonNotificationService.handleError(err.error.message);
            this.spinner.stop('active');
          },
        );
      }
    });
  }

  clear() {
    this.formValue = this.formValueStorageService.getData();
    this.rows = []
    this.commonFilterData = null;
    this.filterData = {
      page: this.formValue.ListOrgAuthorizationComponent?.body?.page ? this.formValue.ListOrgAuthorizationComponent?.body?.page : 1,
      limit: this.formValue.ListOrgAuthorizationComponent?.body?.limit ? this.formValue.ListOrgAuthorizationComponent?.body?.limit : 10,
      companyMasterID: null,
      branchMasterID: null,
      siteID: null,
      orgAuthorizationTypeID: null,
      exportData: false
    }
    this.formValueStorageService.removeData('ListOrgAuthorizationComponent', true);
  }

  getBranch(branchMasterID: any){
    this.getAllSites(branchMasterID);
  }

  getAllSites(branchMasterID: number) {
    this.spinner.start('getAllSites');
    this.api
      .callApi(this.constant.LISTSITE, { companyMasterID: this.filterData.companyMasterID, branchMasterID: branchMasterID }, 'POST', true, false, true)
      .subscribe((res: any) => {
        this.allSites = res.data;
        this.spinner.stop('getAllSites');
      });
  }

}
