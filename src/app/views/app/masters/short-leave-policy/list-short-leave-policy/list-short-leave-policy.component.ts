import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { NgForm } from '@angular/forms';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
@Component({
    selector: 'app-list-short-leave-policy',
    templateUrl: './list-short-leave-policy.component.html',
    styleUrls: ['./list-short-leave-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListShortLeavePolicyComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('datefilter') datefilter: NgForm;
  rows = [];
  comp: any;
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: [+localStorage.getItem('company_id')],
    search: '',
    Export: ''
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  limit = 10;
  usertype: any;
  ipAddress: any;
  adminRoot = environment.adminRoot;
  currentPage: number;
  formValue: any;
  queryString: string;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private notifications: AppNotificationService,
    private http: HttpClient,
    private router: Router,
    private formValueStorageService: FormValueStorageService,
  ) {
  }

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();
    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };
    this.getcompany();
    this.getShortLeaveData();
    this.checkpermission();
    this.getIPAddress();
  }

  getShortLeaveData() {
    this.spinner.start('main');

    let string = `?page=${this.filterData.page}&limit=${this.filterData.limit}`

    if (this.filterData.companyMasterID && this.filterData.companyMasterID.length > 0) {
      this.filterData.companyMasterID.map(e => {
        string += `&companyMasterID[]=${e}`
      })
    }

    if (this.filterData.search) string += `&search=${this.filterData.search}`;

    this.queryString = string

    this.api
      .callApi(this.constant.GETSHORTLEAVEDATA + string, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.page.totalCount = res.totalcount;
            setTimeout(() => {
              this.currentPage = this.filterData.page;
              this.itemsPerPage = this.filterData.limit;
            }, 100);
            this.spinner.stop('main');
          } else {
            this.handleError(res.message);
            this.spinner.stop('main');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('main');
        },
      );
  }

  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.comp = res.data;
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
              permissionval.formName == 'ShortLeavePolicy' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ShortLeavePolicy' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ShortLeavePolicy' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ShortLeavePolicy' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop('permission');
        }
      });
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.filterData.search = '';
      setTimeout(() => {
        this.getShortLeaveData();
      }, 100);
    } else {
      this.filterData.search = inputValue;
      this.getShortLeaveData();
    }
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getShortLeaveData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getShortLeaveData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/masters/short_leave_policy/add_short_leave_policy/']);
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
        let body = {
          id
        };
        this.spinner.start('confirm');
        this.api
          .callApi(this.constant.DELETESHORTLEAVE + id, body, 'DELETE', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });

                this.getShortLeaveData();
                this.spinner.stop('confirm');
              } else {
                this.handleError(res.message);
                this.spinner.stop('confirm');
              }
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop('confirm');
            },
          );
      }
    });
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  alertDeactiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Short Leave will deactive!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, deactive it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          id: id,
          status: '0',
        };
        this.spinner.start('deactive');
        this.api
          .callApi(this.constant.UPDATESHORTLEAVESTATUS, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });

                this.getShortLeaveData();
                this.spinner.stop('deactive');
              } else {
                this.handleError(res.message);
                this.spinner.stop('deactive');
              }
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop('deactive');
            },
          );
      }
    });
  }

  onSubmit() {
    if (!this.datefilter.valid) return;

    this.filterData.companyMasterID = this.datefilter.value.companyMasterID;
    this.getShortLeaveData();
  }

  alertActiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Short Leave will active!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, active it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          id: id,
          status: '1',
        };
        this.spinner.start('active');

        this.api
          .callApi(this.constant.UPDATESHORTLEAVESTATUS, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {

                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });
                this.getShortLeaveData();
              } else {
                this.handleError(res.message);
              }

              this.spinner.stop('active');
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop('active');
            },
          );
      }
    });
  }


  downloadFile() {
    this.spinner.stop('start');

    this.api
      .callApi(this.constant.GETSHORTLEAVEDATA + this.queryString + `&Export=true`, {}, 'GET', true, false, true, true)
      .subscribe(
        (res: any) => this.handleFileDownload(res),
        (err) => {
          if (err.name === 'TimeoutError') {
            this.handleError('TimeoutError');
            this.spinner.stop('start');
          } else {
            this.handleError(err.error.message);
            this.spinner.stop('start');
          }
        },
      );
  }

  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'shortLeave.xlsx');
    this.spinner.stop('start');
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'EditShortLeavePolicyComponent',
      this.filterData,
      '/masters/short_leave_policy/edit_short_leave_policy',
      rowData.id,
    );
  }

  clear() {
    this.datefilter.resetForm();
    this.formValueStorageService.removeData('ListShortLeavePolicyComponent', false);
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }
}
