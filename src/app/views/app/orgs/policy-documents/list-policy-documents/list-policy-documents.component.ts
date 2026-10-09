import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-policy-documents',
    templateUrl: './list-policy-documents.component.html',
    styleUrls: ['./list-policy-documents.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListPolicyDocumentsComponent implements OnInit {
  @ViewChild('companyfilter') companyfilter: NgForm;
  @ViewChild('addimportuser') addimportuser: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  rows = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;

  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  Order = { label: 'Name', value: 'name' };
  changeOrderBy = [
    { label: 'Name', value: 'name' },
    { label: 'Description', value: 'description' },
    { label: 'Created By', value: 'createBy' },
  ];

  scrollBarHorizontal = window.innerWidth < 1201;
  body = {
    page: 1,
    limit: 10,
    searchQuery: '',
    companyMasterID: +localStorage.getItem('company_id'),
    sortByField: '',
    sortByValue: 'ASC',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  events: any;
  filter: any;
  excelevents: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  limit = 10;
  comp: any;
  currentPage: number;
  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private notifications: AppNotificationService,
    private router: Router,
    private formValueStorageService: FormValueStorageService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/orgs/listPolicyDocuments',
          this.adminRoot + '/orgs/listPolicyDocuments/editPolicyDocuments',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListPolicyDocumentsComponent', false);
        }
      }
    });
  }

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();

    if (this.formValueStorageService.isEmptyObject('ListPolicyDocumentsComponent')) {
      this.body = {
        page: 1,
        limit: 10,
        searchQuery: '',
        companyMasterID: +localStorage.getItem('company_id'),
        sortByField: '',
        sortByValue: 'ASC',
      };
    } else {
      this.body = this.formValue.ListPolicyDocumentsComponent.body;
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getAllDataAPi();
    this.checkpermission();
    this.getcompany();
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
              permissionval.formName == 'OrganizationDocument' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'OrganizationDocument' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'OrganizationDocument' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'OrganizationDocument' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  onChangeOrderBy(event): void {
    this.spinner.start();
    this.body.sortByField = event.value;
    this.getAllDataAPi();
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.body.searchQuery = '';
      setTimeout(() => {
        this.getAllDataAPi();
      }, 100);
    } else {
      this.body.searchQuery = inputValue;
      this.getAllDataAPi();
    }
  }

  onSubmit() {
    if (!this.companyfilter.valid) {
      return;
    }
    this.body.companyMasterID = +this.companyfilter.value.companyMasterID;
    this.getAllDataAPi();
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.body.page = e.offset + 1;
      this.getAllDataAPi();
    } else {
      console.log('error');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.body.limit = ev;
      this.limit = this.body.limit;
      this.getAllDataAPi();
    } else {
      console.log('error');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/orgs/listPolicyDocuments/addPolicyDocuments']);
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
        this.spinner.start();
        this.api
          .callApi(this.constant.DELETEPOLICYDOCUMENT + id, {}, 'DELETE', true, true, true)
          .subscribe(
            (res: any) => {
              this.getAllDataAPi();
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              this.spinner.stop();
            },
            (err) => {
              this.notifications.create('Error', err.error.message, NotificationType.Error, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.spinner.stop();
            },
          );
      }
    });
  }

  ViewDocument(item) {
    window.open(this.apiURL + item.document, '_blank');
  }

  clear() {
    this.companyfilter.resetForm();

    this.formValueStorageService.removeData('ListPolicyDocumentsComponent', false);
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }

  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.comp = res.data;
          this.spinner.stop();
        }
      });
  }

  getAllDataAPi() {
    this.spinner.start('start');

    let queryString = `?page=${this.body.page}&pageSize=${this.body.limit}`;

    if (this.body.companyMasterID) {
      queryString += `&companyMasterID=${this.body.companyMasterID}`;
    }

    if (this.body.searchQuery) {
      queryString += `&search=${this.body.searchQuery}`;
    }

    if (this.body.sortByField) {
      queryString += `&sortByField=${this.body.sortByField}&sortByValue=${this.body.sortByValue}`;
    }

    this.api
      .callApi(this.constant.GETALLPOLICYDOCUMENT + queryString, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          this.rows = res.data;
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          this.spinner.stop('start');
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('start');
        },
      );
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListPolicyDocumentsComponent',
      this.body,
      '/orgs/listPolicyDocuments/editPolicyDocuments',
      rowData.id,
    );
  }

}
