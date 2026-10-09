import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { saveAs } from 'file-saver';
import { NgForm } from '@angular/forms';
import { eventNames } from 'process';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { HttpClient } from '@angular/common/http';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { CommonFilterButtonFields, CommonFilterFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-employeeincentive',
    templateUrl: './list-employeeincentive.component.html',
    styleUrls: ['./list-employeeincentive.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListEmployeeincentiveComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('addimportincentive') addimportincentive: NgForm;
  @ViewChild('closeModal2') closeModal2: any;
  rows = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;

  ColumnMode = ColumnMode.force;
  itemOptionsPerPage = ItemOptionsPerPageArray;

  company: any;
  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear, CommonFilterButtonFields.Import];
  commonFilterData: any

  filterData = {
    userMasterID: [],
    month: '',
    companyMasterID: null,
    branchMasterID: null,
    incentivetype: '',
    searchQuery: '',
    page: 1,
    limit: 10,
  };

  page = {
    totalCount: 0,
    offset: 0,
  };
  limit = 10;

  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];

  list: any;
  file: any;
  format: string;
  url: string | ArrayBuffer;
  showdemoExcel: boolean = false;
  companyID: string;
  ipAddress: string;
  company_id1: number;

  currentPage: number;
  formValue: any;
  nonEditableList = ['attendance bonus', 'food allowance', 'tea/coffee allowance', 'extra days'];

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private formValueStorageService: FormValueStorageService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/payrolls/list-employeeincentive',
          this.adminRoot + '/payrolls/list-employeeincentive/edit-employeeincentive',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListEmployeeincentiveComponent', false);
          formValueStorageService.removeData('commonFilterData', true);
        }
      }
    });
  }

  ngOnInit(): void {
    this.company_id1 = Number(localStorage.getItem('company_id'));

    // if (this.formValueStorageService.isEmptyObject('ListEmployeeincentiveComponent')) {
    //   this.filterData = {
    //     userMasterID: [],
    //     month: '',
    //     companyMasterID: Number(localStorage.getItem('company_id')),
    //     branchMasterID: null,
    //     incentivetype: '',
    //     searchQuery: '',
    //     page: 1,
    //     limit: 10,
    //   };
    // } else {
    //   this.filterData = this.formValue?.ListEmployeeincentiveComponent?.body;
    // }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getIPAddress();
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
              permissionval.formName == 'EmployeeIncentive' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'EmployeeIncentive' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'EmployeeIncentive' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'EmployeeIncentive' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  Export() {
    const body = {
      userMasterID: this.filterData.userMasterID,
      month: this.filterData.month,
      companyMasterID: this.filterData.companyMasterID,
      incentivetype: this.filterData.incentivetype,
      searchQuery: this.filterData?.searchQuery,
      page: '',
      limit: '',
      export: true,
    };

    this.spinner.start('a');

    this.api
      .callApi(this.constant.GETALLEMPLOYEEINCENTIVEDATA, body, 'POST', true, true, true, true)
      .subscribe(
        (res: any) => {
          if (res.type == 'application/json') {
            this.notifications.create('No data found to export!', '', NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('a');
          } else {
            var blob = new Blob([res], { type: 'text/xlsx' });
            saveAs(blob, 'EmployeeIncentive.xlsx');

            this.spinner.stop('a');
          }
        },
        (err) => {
          this.notifications.create(
            '',
            err.error.message || 'Someting Went Wrong!',
            NotificationType.Bare,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            },
          );
          this.spinner.stop('a');
        },
      );
  }

  onSelectFiles(event: any) {
    let filename = event.target.files[0].name;

    let ext = filename.substring(filename.lastIndexOf('.') + 1);

    this.file = event.target.files && event.target.files[0];
    if (this.file) {
      var reader = new FileReader();
      reader.readAsDataURL(this.file);
      if (this.file.type.indexOf('image') > -1) {
        this.format = 'image';
      } else if (this.file.type.indexOf('video') > -1) {
        this.format = 'video';
      }
      reader.onload = (event) => {
        this.url = (<FileReader>event.target).result;
      };
    }
  }

  addIncentiveData() {
    if (!this.addimportincentive.valid) {
      return;
    }

    const formData = new FormData();

    formData.append('file', this.file);
    formData.append('companyMasterID', this.companyID);
    formData.append('month', this.addimportincentive.value.month.replace('-', ''));
    formData.append('createBy', localStorage.getItem('id'));
    formData.append('createByIP', this.ipAddress);
    formData.append('fileName', 'incentive');

    this.spinner.start();
    this.api
      .callApi(this.constant.UPLOADVARIABLEEXCEL, formData, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });

            this.closeModal2.nativeElement.click();
            this.addimportincentive.resetForm();
            this.showdemoExcel = false;
          } else {
            this.notifications.create('Error', res.message, NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            }),
              this.addimportincentive.resetForm();
            this.showdemoExcel = false;
            this.spinner.stop();
          }
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.addimportincentive.resetForm();
          this.showdemoExcel = false;
          this.spinner.stop();
        },
      );
  }

  showdemo(id) {
    if (id) {
      this.companyID = id;
      this.showdemoExcel = true;
    } else {
      this.companyID = '';
      this.showdemoExcel = false;
    }
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  downloadDemo() {
    this.spinner.start('a');

    const queryString = `?companyMasterID=${this.companyID}&fileName=incentive`;

    this.api
      .callApi(this.constant.GETVARIABLEDEMOEXCEL + queryString, {}, 'GET', true, true, true, true)
      .subscribe(
        (res: any) => {
          if (res.type == 'application/json') {
            this.notifications.create('No data found to export!', '', NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('a');
          } else {
            var blob = new Blob([res], { type: 'text/xlsx' });
            saveAs(blob, 'incentive.xlsx');

            this.spinner.stop('a');
          }
        },
        (err) => {
          this.notifications.create(
            '',
            err.error.message || 'Someting Went Wrong!',
            NotificationType.Bare,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            },
          );
          this.spinner.stop('a');
        },
      );
  }

  getalldata() {
    this.spinner.start('emp');
    this.api
      .callApi(
        this.constant.GETALLEMPLOYEEINCENTIVEDATA,
        this.filterData,
        'POST',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          if (this.rows.length > 0) {
            this.showButtons.push(CommonFilterButtonFields.Excel);
            setTimeout(() => {
              this.currentPage = this.filterData.page;
            });
          } else {
            this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear, CommonFilterButtonFields.Import];
          }
          this.page.totalCount = res.totalcount;
          this.currentPage = this.filterData.page;
          this.spinner.stop('emp');
        }
      });
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.page = Math.min(this.filterData.page, Math.ceil(this.page.totalCount / this.limit));
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getalldata();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  getEmployeeIncentiveByName(companyMasterID: Number) {
    this.spinner.start('name');
    this.api
      .callApi(this.constant.GETBYNAME, { companyMasterID }, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.list = res.data;

          this.spinner.stop('name');
        }
      });
  }

  onSubmit(val: any) {
    this.commonFilterData = val;
    this.filterData.companyMasterID = val?.company;
    this.filterData.incentivetype = val?.incentivetypename;
    this.filterData.month = val?.yearmonth
      ? val?.yearmonth.replace('-', '')
      : '';
    this.filterData.userMasterID = val?.user;

    this.getalldata();
  }

  clear() {
    this.formValue = this.formValueStorageService.getData();
    this.commonFilterData = null
    this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear, CommonFilterButtonFields.Import];
    this.rows = []
    this.filterData = {
      userMasterID: [],
      month: '',
      companyMasterID: null,
      branchMasterID: null,
      incentivetype: '',
      searchQuery: '',
      page: this.formValue.ListEmployeeincentiveComponent?.body?.page ? this.formValue.ListEmployeeincentiveComponent?.body?.page : 1,
      limit: this.formValue.ListEmployeeincentiveComponent?.body?.limit ? this.formValue.ListEmployeeincentiveComponent?.body?.limit : 10,
    };
    this.formValueStorageService.removeData('ListEmployeeincentiveComponent', false);
  }

  alertConfirmation(id: any) {
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
          employeeincentiveID: id,
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.DELETEEMPLOYEEINCENTIVE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.getalldata()
              this.spinner.stop();
            },
            (err) => {
              console.log('error', err);
              this.spinner.stop();
            },
          );
      }
    });
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/payrolls/list-employeeincentive/add-employeeincentive']);
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getalldata();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.getalldata();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getalldata();
    }
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  navigateToEditPage(rowData: any): void {
    if (this.commonFilterData && this.commonFilterData != null && Object.keys(this.commonFilterData).length > 0)
      this.formValueStorageService.addData(
        'commonFilterData',
        this.commonFilterData
      );
    this.formValueStorageService.navigate(
      'ListEmployeeincentiveComponent',
      this.filterData,
      '/payrolls/list-employeeincentive/edit-employeeincentive',
      rowData.employeeincentiveID,
    );
  }

  initGetCompany(companyMasterID: Number) {
    this.getEmployeeIncentiveByName(companyMasterID);
    this.filterData.companyMasterID = companyMasterID;
    this.companyID = String(companyMasterID);
    if (companyMasterID)
      this.showdemoExcel = true;
    this.getalldata()
    this.getcompany(companyMasterID)
  }

  getcompany(companyMasterID: Number) {
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, { companyMasterID }, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.company = res.data;
          this.spinner.stop('company');
        } else {
          this.handleError(res.message);
          this.spinner.stop('company');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('company');
      },
    );
  }
}
