import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ModalService } from 'src/app/services/modal.service';
import { HttpClient } from '@angular/common/http';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { NavigationStart } from '@angular/router';
import { saveAs } from 'file-saver';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
@Component({
    selector: 'app-list-contractor',
    templateUrl: './list-contractor.component.html',
    styleUrls: ['./list-contractor.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListContractorComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  page = {
    totalCount: 0,
    offset: 0,
  };
  length: number;
  filterform = {
    companyMasterID: [Number(localStorage.getItem('company_id'))],
    page: 1,
    limit: 10,
    searchQuery: '',
  };
  limit = 10;
  rows = [];
  rows1: any = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;
  scrollBarHorizontal = window.innerWidth < 1201;
  columns = [];
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  currentPage: number;
  filterData1: any;
  ipAddress: any;
  filter1: string;
  comp: any;
  company_id: number;
  company1: any;
  alluser: any[];
  formValue: any;
  querystring: string;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  bankdata: any;


  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/masters/cotractor',
          this.adminRoot + '/masters/cotractor/edit_cotractor',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListContractorComponent', false);
        }
      }
    });
  }
  ngOnInit(): void {
    this.company_id = +localStorage.getItem('company_id');

    this.getIPAddress();
    this.getcompany();
    this.checkpermission();
    this.getBankData();


    this.formValue = this.formValueStorageService.getData();


    if (this.formValueStorageService.isEmptyObject('ListContractorComponent')) {
      this.filterform = {
        page: 1,
        limit: 10,
        companyMasterID: [+localStorage.getItem('company_id')],
        searchQuery: '',
      };
    } else {
      this.filterform = this.formValue.ListContractorComponent.body;
    }


    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getConstructorData();

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
              permissionval.formName == 'Contractor' && permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Contractor' && permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Contractor' && permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Contractor' && permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
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


  onChange(e: any) {
    if (e) {
      this.filterform.page = e.offset + 1;
      this.getConstructorData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();

    if (inputValue.length == 0) {
      this.filterform.searchQuery = '';
      setTimeout(() => {
        this.getConstructorData();
      }, 100);
    } else {
      this.filterform.searchQuery = inputValue;
      this.getConstructorData();
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterform.limit = ev;
      this.limit = this.filterform.limit;
      this.getConstructorData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }

    this.filterform.companyMasterID = this.datefilter.value.company;
    this.getConstructorData();
  }

  getBankData() {
    this.spinner.start();
    let filter = { page: '', limit: '' };
    this.api.callApi(this.constant.GETBANKDATA, filter, 'POST', false, true, true).subscribe(
      (res: any) => {
        this.bankdata = res.data;
        this.spinner.stop();
      },
      (err) => {
        this.notifications.create('Error', err.error.message, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
      },
    );
  }

  getConstructorData() {
    let string = `?page=${this.filterform.page}&limit=${this.filterform.limit}`

    if (this.filterform.searchQuery) string += `&searchQuery=${this.filterform.searchQuery}`

    if (this.filterform.companyMasterID && this.filterform.companyMasterID.length > 0) {
      this.filterform.companyMasterID.map(e => {
        string += `&companyMasterID[]=${e}`
      })
    }

    this.querystring = string

    this.spinner.start('getData');
    this.api
      .callApi(this.constant.GETALLDATA + string, {}, 'GET', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.filterform.page;
            this.itemsPerPage = this.filterform.limit;
          }, 100);
        }
        this.spinner.stop('getData');
      },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('getData');
        },);
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/masters/cotractor/add_cotractor']);
  }


  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  alertDeactiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'User will deactive!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, deactive it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          contractorId: id,
          status: '0',
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.STATUSCHANGE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: false,
                });
                this.getConstructorData();
                this.spinner.stop();
              } else {
                this.notifications.create(
                  'Error',
                  'You cannot deactive this checklist because it is filled by an employee',
                  NotificationType.Bare,
                  { theClass: 'outline primary', timeOut: 3000, showProgressBar: false },
                );
              }
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop();
            },
          );
      }
    });
  }

  alertActiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'User will active!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, active it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          contractorId: id,
          status: '1',
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.STATUSCHANGE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.getConstructorData();
              this.spinner.stop();
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop();
            },
          );
      }
    });
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
        this.spinner.start('confirm');
        this.api
          .callApi(this.constant.DELETEDATA + +id, {}, 'DELETE', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });

                this.getConstructorData();

              } else {
                this.handleError(res.message);
              }
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
    this.spinner.start('download');

    this.api
      .callApi(this.constant.GETALLDATA + this.querystring + `&Export=true`, {}, 'GET', true, false, true, true)
      .subscribe(
        (res: any) => this.handleFileDownload(res),
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('download');
        },
      );
  }


  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'Contractor.xlsx');
    this.spinner.stop('download');
  }


  navigateToEditPage(rowData: any): void {

    this.formValueStorageService.navigate(
      'ListContractorComponent',
      this.filterform,
      '/masters/cotractor/edit_cotractor',
      rowData.contractorId,
    );
  }

  clear() {
    this.datefilter.resetForm();
    this.formValueStorageService.removeData('ListContractorComponent', false);
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }
  importExcel() {
    this.router.navigate([this.adminRoot + '/masters/cotractor/import_contractor/']);
  }
}