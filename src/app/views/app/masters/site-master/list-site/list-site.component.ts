import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { DownloadFileService } from 'src/app/services/download-file.service';

@Component({
    selector: 'app-list-site',
    templateUrl: './list-site.component.html',
    styleUrls: ['./list-site.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListSiteComponent implements OnInit {
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
    companyMasterID: +localStorage.getItem('company_id'),
    searchQuery: '',
    exportData: false,
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  events: any;
  filter: any;
  export: any;
  excelevents: any;
  permissionSync: any = [];
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  limit = 10;
  company_id: any;
  alluser: any;
  company1: any;
  designation1: any;
  image: any;
  target: any;
  resultColumns: any[];
  resultColumns1: any[];
  childcompany: string;
  selected1: any = [];
  companydata: any;
  allasset: any = [];
  selected2: any = [];
  salary: boolean;
  companymasterName: any;
  public users: Array<any> = [];
  employee: any;
  allbranch: any;
  branchfilter: boolean = false;
  employeedata: any;
  currentPage: number;

  alldesignation: any;
  alldepartment: any;
  divisionfilter: any;
  departmentfilter: any;
  designationfilter: any;
  workingareafilter: any;
  selecteddesig: any[];
  selectedDepartment: any[];

  selectedBranch: any[];
  isResetForm: boolean = false;
  adminRoot = environment.adminRoot;
  editData: any;

  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,
    private formValueStorageService: FormValueStorageService,
    private commonNotificationService: CommonNotificationService,
    private downloadFileService: DownloadFileService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
    {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          const protectedRoutes = [
            this.adminRoot + '/masters/site',
            this.adminRoot + '/masters/site/editSite',
          ];

          const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
          if (!isProtectedRoute) {
            formValueStorageService.removeData('ListSiteComponent', false);
          }
        }
      });
    }
  }

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();
    this.filterData = {
      page: 1,
      limit: 10,
      companyMasterID: +localStorage.getItem('company_id'),
      searchQuery: '',
      exportData: false,
    };
    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };
    this.getcompany();
    this.checkpermission();
    this.getSiteData();
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
              permissionval.formName == 'siteMaster' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'siteMaster' && permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'siteMaster' && permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'siteMaster' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.permissionSync = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'siteMaster' && permissionval.operationName.includes('Sync')
            );
          });
          this.spinner.stop();
        }
      });
  }

  getcompany() {
    const body = {
      companyMasterID: +localStorage.getItem('company_id'),
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.company1 = res.data;
          this.spinner.stop('company');
        } else {
          this.commonNotificationService.handleError(res.message);
          this.spinner.stop('company');
        }
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message);
        this.spinner.stop('company');
      },
    );
  }

  getSiteData() {
    this.spinner.start('users');
    this.api.callApi(this.constant.LISTSITE, this.filterData, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.page.totalCount = res.totalcount;
        }
        this.spinner.stop('users');
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message);
        this.spinner.stop('start');
      },
    );
  }
  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }
    this.filterData.page = 1;
    this.filterData.limit = 10;
    this.getSiteData();
  }
  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/masters/site/addSite/']);
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getSiteData();
    } else {
      console.log('error');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getSiteData();
    } else {
      console.log('error');
    }
  }
  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.getSiteData();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getSiteData();
    }
  }
  clear() {
    this.datefilter.resetForm();

    setTimeout(() => {
      this.rows = [];
      this.filterData = {
        companyMasterID: +localStorage.getItem('company_id'),
        page: 1,
        limit: 10,
        searchQuery: '',
        exportData: false,
      };
      this.page = {
        totalCount: 0,
        offset: 0,
      };
      this.ngOnInit();
    }, 200);
  }

  download() {
    if (!this.datefilter.valid) {
      return;
    }
    let body1 = {
      page: '',
      limit: '',
      companyMasterID: this.filterData.companyMasterID,
      searchQuery: this.filterData.searchQuery,
      exportData: true,
    };
    this.spinner.start('start');
    this.api.callApi(this.constant.LISTSITE, body1, 'POST', true, false, true, true).subscribe(
      (res: any) => {
        this.downloadFileService.handleFileDownload(res, 'Site.xlsx', 'text/xlsx');
        this.spinner.stop('start');
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message);
        this.spinner.stop('start');
      },
    );
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListSiteComponent',
      this.filterData,
      '/masters/site/editSite/',
      rowData.siteID,
    );
  }

  alertConfirmation(siteID: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          siteID: siteID,
        };
        this.spinner.start('confirm');
        this.api.callApi(this.constant.DELETESITE, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.getSiteData();
              this.spinner.stop('confirm');
            } else {
              this.commonNotificationService.handleError(res.message);
              this.spinner.stop('confirm');
            }
          },
          (err) => {
            this.commonNotificationService.handleError(err.error.message);
            this.spinner.stop('confirm');
          },
        );
      }
    });
  }

  alertDeactiveConfirmation(siteID: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Site will deactive!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, deactive it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          siteID,
          status: '0',
        };
        this.spinner.start('deactive');
        this.api.callApi(this.constant.CHANGESITESTATUS, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.commonNotificationService.handleSuccess(res.message);

              this.getSiteData();
              this.spinner.stop('deactive');
            } else {
              this.commonNotificationService.handleWarning(res.message);
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

  alertActiveConfirmation(siteID: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Site will active!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, active it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          siteID,
          status: '1',
        };
        this.spinner.start('active');
        this.api.callApi(this.constant.CHANGESITESTATUS, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.commonNotificationService.handleSuccess(res.message);
              this.getSiteData();
              this.spinner.stop('active');
            } else {
              this.commonNotificationService.handleWarning(res.message);
              this.spinner.stop('active');
            }
          },
          (err) => {
            this.commonNotificationService.handleError(err.error.message);
            this.spinner.stop('active');
          },
        );
      }
    });
  }

  importExcel() {
    this.router.navigate([this.adminRoot + '/masters/site/importSite/']);
  }
}
