import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { CommonFilterButtonFields, CommonFilterFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-authorization',
    templateUrl: './list-authorization.component.html',
    styleUrls: ['./list-authorization.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListAuthorizationComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear, CommonFilterButtonFields.Import];

  rows = [];

  itemOptionsPerPage = ItemOptionsPerPageArray;
  adminRoot = environment.adminRoot;
  @ViewChild('addimportCompanyData') addimportCompanyData: NgForm;

  selected: any = ['AuthorizationCriteria', 'AuthName', 'UserName', 'Company', 'Status'];
  tabledata: any = [
    'AuthorizationCriteria',
    'AuthName',
    'UserName',
    'Company',
    'Status',
    'CreateBy',
    'CreatedAt',
    'updateBy',
    'UpdatedAt',
  ];
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: +localStorage.getItem('company_id'),
    startdate: '',
    enddate: '',
    userMasterID: '',
    AuthorizationMasterID: '',
  };
  limit = 10;

  page = {
    totalCount: 0,
    offset: 0,
  };

  formValue: any

  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];

  authdata: any;
  ipAddress: any;
  currentPage: number;

  comp: any;
  companyDataFile: any;
  format: string;
  url: string | ArrayBuffer;
  showdemoexcel: boolean;

  commonFilterData: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
    private notifications: AppNotificationService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/orgs/authorization',
          this.adminRoot + '/orgs/authorization/edit_authorization',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListAuthorizationComponent', false);
          formValueStorageService.removeData('commonFilterData', true);
        }
      }
    });
  }

  ngOnInit() {
    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.checkpermission();
  }

  getAuthData() {
    this.spinner.start('getAuth');
    let body = {
      page: '',
      limit: '',
    };
    this.api
      .callApi(this.constant.GETAUTHMASTER, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.authdata = res.data;

          this.spinner.stop('getAuth');
        }
      });
  }

  getformauthorization() {
    this.spinner.start('formAuth');
    this.api
      .callApi(this.constant.GETAUTHORIZATION, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            if (this.rows.length > 0) {
              this.showButtons.push(CommonFilterButtonFields.Excel)
            } else {
              this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear, CommonFilterButtonFields.Import];
            }
            this.page.totalCount = res.totalcount;
            setTimeout(() => {
              this.currentPage = this.filterData.page;
            }, 100);
            this.spinner.stop('formAuth');
          } else {
            this.handleError(res.message);
            this.spinner.stop('formAuth');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('formAuth');
        },
      );
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
          this.permissiondelete = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Authorization' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Authorization' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Authorization' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Authorization' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop('permission');
        }
      });
  }

  onSubmit(val: any) {
    this.commonFilterData = val;
    this.filterData.companyMasterID = val.company;
    this.filterData.startdate = "";
    this.filterData.enddate = "";

    this.filterData.AuthorizationMasterID = val?.authorizationMasterID ? val?.authorizationMasterID : "";
    this.filterData.userMasterID = val?.user ? val?.user : ''

    this.getformauthorization();
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getformauthorization();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getformauthorization();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/orgs/authorization/add_authorization']);
  }

  alertConfirmation(id, authmasterid) {
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
          AuthorizationDetailsId: id,
          AuthMasterID: authmasterid,
          updateBy: localStorage.getItem('id'),
          updateByIp: this.ipAddress,
        };
        this.spinner.start('confirm');
        this.api
          .callApi(this.constant.DELETEAUTHORIZATION, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.getformauthorization();
              this.spinner.stop('confirm');
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop('confirm');
            },
          );
      }
    });
  }

  downloadFile() {
    this.spinner.start('start');
    let mainbody = {
      page: '',
      limit: '',
      startdate: this.filterData.startdate,
      enddate: this.filterData.enddate,
      userMasterID: this.filterData.userMasterID,
      AuthorizationMasterID: this.filterData.AuthorizationMasterID,
      companyMasterID: this.filterData.companyMasterID,
      exportData: true,
    };
    this.api
      .callApi(this.constant.GETAUTHORIZATION, mainbody, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => this.handleFileDownload(res),
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
  }

  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'Authorization.xlsx');
    this.spinner.stop('start');
  }

  clear() {
    this.commonFilterData = null;
    this.formValue = this.formValueStorageService.getData();
    this.selected = ['AuthorizationCriteria', 'AuthName', 'UserName', 'Company', 'Status'];
    this.filterData = {
      page: this.formValue.ListAuthorizationComponent?.body?.page ? this.formValue.ListAuthorizationComponent?.body?.page : 1,
      limit: this.formValue.ListAuthorizationComponent?.body?.limit ? this.formValue.ListAuthorizationComponent?.body?.limit : 10,
      companyMasterID: +localStorage.getItem('company_id'),
      startdate: '',
      enddate: '',
      userMasterID: '',
      AuthorizationMasterID: '',
    };
    this.rows = []
    this.formValueStorageService.removeData('ListAuthorizationComponent', false);
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  navigateToEditPage(rowData: any): void {
    if(this.commonFilterData && this.commonFilterData != null && Object.keys(this.commonFilterData).length > 0)
    this.formValueStorageService.addData(
      'commonFilterData',
      this.commonFilterData
    );

    this.formValueStorageService.navigate(
      'ListAuthorizationComponent',
      this.filterData,
      '/orgs/authorization/edit_authorization',
      rowData.AuthorizationDetailsId,
    );
  }

  showdemo(id) {
    if (id == undefined) {
      this.showdemoexcel = false;
    } else {
      this.showdemoexcel = true;
    }
  }
  onSelectFiles2(event: any) {
    let filename = event.target.files[0].name;

    let ext = filename.substring(filename.lastIndexOf('.') + 1);

    this.companyDataFile = event.target.files && event.target.files[0];
    if (this.companyDataFile) {
      var reader = new FileReader();
      reader.readAsDataURL(this.companyDataFile);
      if (this.companyDataFile.type.indexOf('image') > -1) {
        this.format = 'image';
      } else if (this.companyDataFile.type.indexOf('video') > -1) {
        this.format = 'video';
      }
      reader.onload = (event) => {
        this.url = (<FileReader>event.target).result;
      };
    }
  }


  demoImportCompanyData() {
    if (!this.addimportCompanyData.value.company) return;

    this.spinner.start('start');

    this.api
      .callApi(this.constant.EXPORTAUTH + '?companyMasterID=' + this.addimportCompanyData.value.company, {}, 'GET', true, false, true, true)
      .subscribe(
        (res: any) => this.handleFileDownload1(res),
        (err) => {
          this.handleError1(err.error.message);
          this.spinner.stop('start');
        },
      );
  }

  private handleFileDownload1(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'Update Authorization.xlsx');
    this.spinner.stop('start');
  }

  private handleError1(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }


  importExcel() {
    this.router.navigate([this.adminRoot + '/orgs/authorization/import_authorization/']);
  }

  getCompany(val: any) {
    this.filterData.companyMasterID = val;
    this.getformauthorization();
  }

  initData(companyMasterID: number){
    this.getAuthData();
  }
}
