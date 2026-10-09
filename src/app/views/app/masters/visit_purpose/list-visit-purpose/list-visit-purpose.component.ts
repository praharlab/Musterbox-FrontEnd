import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { saveAs } from 'file-saver';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgForm } from '@angular/forms';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-visit-purpose',
    templateUrl: './list-visit-purpose.component.html',
    styleUrls: ['./list-visit-purpose.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListVisitPurposeComponent implements OnInit {
  @ViewChild('addimportuser') addimportuser: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('lgModal') modal: any;
  @ViewChild('datefilter') datefilter: NgForm;

  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  rows1: any = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;

  myInputVariable: ElementRef;
  columns = [
    { name: 'Purpose', prop: 'visitPurpose' },
    { name: 'Company Name', prop: 'companyTypename' },
    { name: 'Id', prop: 'visitPurposeID' },
    { name: 'Status', prop: 'status' },
  ];
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = [];
  SelectionType = SelectionType;
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: [+localStorage.getItem('company_id')],
    searchQuery: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  product: any = [];
  usertype: any;
  company_id: any;
  file: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  childcompany: string;
  ipAddress: any;
  comp: any;
  events: any;

  limit = 10;
  currentPage: number;
  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private formValueStorageService: FormValueStorageService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/masters/ListVisitPurposeComponent',
          this.adminRoot + '/masters/EditVisitPurposeComponent',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListVisitPurposeComponent', false);
        }
      }
    });
  }

  ngOnInit() {
    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.formValue = this.formValueStorageService.getData();

    if (this.formValueStorageService.isEmptyObject('ListVisitPurposeComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        companyMasterID: [+localStorage.getItem('company_id')],
        searchQuery: '',
      };
    } else {
      this.filterData = this.formValue.ListVisitPurposeComponent.body;
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getcompany();
    this.getproduct();
    this.getVisitPurpose();
    this.checkpermission();
  }

  getVisitPurpose() {
    this.spinner.start('oninit2');
    this.api
      .callApi(this.constant.VISITPURPOSEBYCOMPANYDATA, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.temp = [...this.rows];
            this.page.totalCount = res.totalcount;
            setTimeout(() => {
              this.currentPage = this.filterData.page;
              this.itemsPerPage = this.filterData.limit;
            }, 100);
            this.spinner.stop('oninit2');
          } else {
            this.handleError(res.message);
            this.spinner.stop('oninit2');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('oninit2');
        },
      );
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
              permissionval.formName == 'VisitPurpose' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'VisitPurpose' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'VisitPurpose' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'VisitPurpose' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  getproduct() {
    if (this.usertype == 2) {
      const body = {
        page: '',
        limit: '',
        companyMasterID: localStorage.getItem('company_id'),
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETVISITPURPOSEDATA, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.product = res.data;
            this.spinner.stop();
          }
        });
    } else {
      const body = {
        companyMasterID: this.company_id,
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.product = res.data;

            this.spinner.stop();
          }
        });
    }
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.getVisitPurpose();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getVisitPurpose();
    }
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }
    this.filterData.companyMasterID = this.datefilter.value.companyMasterID;
    this.getVisitPurpose();
  }
  onSelect({ selected }): void {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    this.setSelectAllState();
  }

  setSelectAllState(): void {
    if (this.selected.length === this.rows.length) {
      this.selectAllState = 'checked';
    } else if (this.selected.length !== 0) {
      this.selectAllState = 'indeterminate';
    } else {
      this.selectAllState = '';
    }
  }

  selectAllChange($event): void {
    if ($event.target.checked) {
      this.selected = [...this.rows];
    } else {
      this.selected = [];
    }
    this.setSelectAllState();
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getVisitPurpose();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getVisitPurpose();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/masters/visit_purpose/add_visit_purpose']);
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
          visitPurposeID: id,
        };
        this.spinner.start('confirm');
        this.api
          .callApi(this.constant.DELETEVISITPURPOSEDATA, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });
                this.getVisitPurpose();
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
  alertDeactiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Record will be deactivated!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, Deactivate it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          visitPurposeID: id,
          status: '0',
        };
        this.spinner.start('deactive');
        this.api
          .callApi(this.constant.VISITPURPOSEDATASTATUSCHANGES, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });
                this.getVisitPurpose();
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
  alertActiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Record will be activated!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, activate it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          visitPurposeID: id,
          status: '1',
        };
        this.spinner.start('active');
        this.api
          .callApi(this.constant.VISITPURPOSEDATASTATUSCHANGES, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              this.getVisitPurpose();
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

  selectcompany(ev: any) {
    this.spinner.start();
    this.api
      .callApi(this.constant.VISITPURPOSEBYCOMPANYDATA + ev, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.rows = res.data;

          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          this.spinner.stop();
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop();
        },
      );
  }

  onSelectFile(event: any) {
    this.file = event.target.files && event.target.files[0];
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

  submit() {
    if (this.file) {
      const formData = new FormData();
      if (this.childcompany == 'false') {
        formData.append('file', this.file);
        formData.append('companyMasterID', this.addimportuser.value.company);
        formData.append('createBy', localStorage.getItem('id'));
        formData.append('createByIp', this.ipAddress);
      } else {
        formData.append('file', this.file);
        formData.append('companyMasterID', localStorage.getItem('company_id'));
        formData.append('createBy', localStorage.getItem('id'));
        formData.append('createByIp', this.ipAddress);
      }
      this.spinner.start();
      this.api
        .callApi(this.constant.UPLOADVISITPURPOSEEXCEL, formData, 'POST', true, true, true)
        .subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });

              this.file = {};
              this.addimportuser.resetForm();
              this.closeModal.nativeElement.click();

              setTimeout(() => {
                this.modal.hide();
                this.ngOnInit();
                this.spinner.stop();
              }, 3000);
            } else {
              this.handleError(res.message);

              this.file = {};
              this.addimportuser.resetForm();
              this.closeModal.nativeElement.click();

              this.myInputVariable.nativeElement.value = '';
              this.spinner.stop();
            }
          },
          (err) => {
            this.handleError(err.error.message);
            this.file = {};
            this.addimportuser.resetForm();
            this.closeModal.nativeElement.click();

            this.myInputVariable.nativeElement.value = '';
            this.spinner.stop();
          },
        );
    }
  }

  demo() {
    window.open('/assets/Visitpurpose.xlsx', '_blank');
  }

  downloadFile() {
    this.spinner.start('start');

    let mainbody: any = {
      page: '',
      limit: '',
      companyMasterID: this.filterData.companyMasterID,
      searchQuery: this.filterData.searchQuery,
      exportData: true,
    };

    this.api
      .callApi(this.constant.GETVISITPURPOSEDATA, mainbody, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => this.handleFileDownload(res),
        (err) => {
          this.handleError(err);
          this.spinner.stop('start');
        },
      );
  }

  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'Visit_Purpose.xlsx');
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
      'ListVisitPurposeComponent',
      this.filterData,
      '/masters/visit_purpose/edit_visit_purpose',
      rowData.visitPurposeID,
    );
  }

  clear() {
    this.datefilter.resetForm();

    this.formValueStorageService.removeData('ListVisitPurposeComponent', false);
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }
  importExcel() {
    this.router.navigate([this.adminRoot + '/masters/visit_purpose/import_visit_purpose/']);
  }

}
