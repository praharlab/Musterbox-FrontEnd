import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { saveAs } from 'file-saver';
import { RatingComponent } from 'ngx-bootstrap/rating';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-review-form',
    templateUrl: './list-review-form.component.html',
    styleUrls: ['./list-review-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListReviewFormComponent implements OnInit {
  @ViewChild('companyfilter') companyfilter: NgForm;
  @ViewChild('extrafilter') extrafilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  @ViewChild('rating') ratingComponent: RatingComponent;
  @ViewChild('rateText1') rateText1: RatingComponent;

  rows: any = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;
  ColumnMode = ColumnMode;
  temp: any = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;

  Order = { label: 'Title', value: 'title' };

  changeOrderBy = [
    { label: 'title', value: 'title' },
    { label: 'Description', value: 'description' },
    { label: 'Created By', value: 'createdBy' },
  ];

  body = {
    page: 1,
    limit: 10,
    searchQuery: '',
    company_id: Number(localStorage.getItem('company_id')),
    sortByField: '',
    sortByValue: 'ASC',
  };

  page = {
    totalCount: 0,
    offset: 0,
  };

  rate: number = 0;
  rateReadonly = 5;

  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  limit = 10;
  company_id: any;
  selectedValue: string;
  query: string;
  comp: any;
  modalData: any = [];
  selectedCompany_id: number;
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
    this.rate = 0; // Assuming initial value is 0

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [this.adminRoot + '/pms/reviewform', this.adminRoot + '/pms/reviewform/editReviewForm'];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListReviewFormComponent', false);
        }
      }
    });
    
  }

  ngOnInit() {
    this.selectedCompany_id = +localStorage.getItem('company_id');

    this.formValue = this.formValueStorageService.getData();

    if (this.formValueStorageService.isEmptyObject('ListReviewFormComponent')) {
      this.body = {
        page: 1,
        limit: 10,
        searchQuery: '',
        company_id: Number(localStorage.getItem('company_id')),
        sortByField: '',
        sortByValue: 'ASC',
      };
    } else {
      this.body = this.formValue.ListReviewFormComponent.body;
      this.body.sortByField = '';
      this.body.sortByValue = 'ASC';
    }

    this.company_id = localStorage.getItem('company_id');
    this.checkpermission();
    this.getReviewFormData();
    this.getcompany();
  }

  getReviewFormData() {
    this.spinner.start('start');
    let queryString = `?page=${this.body.page}&pageSize=${this.body.limit}`;
    if (this.body.company_id) {
      queryString += `&companyMasterID=${this.body.company_id}`;
    }
    if (this.body.searchQuery) {
      queryString += `&search=${this.body.searchQuery}`;
    }
    if (this.body.sortByField) {
      queryString += `&sortByField=${this.body.sortByField}&sortByValue=${this.body.sortByValue}`;
    }
    this.query = queryString;
    this.api
      .callApi(this.constant.GETALLREVIEWFORM + queryString, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          this.rows = res.data;
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.body.page;
            this.itemsPerPage = this.body.limit;
          }, 100);
          this.spinner.stop('start');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('start');
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
              permissionval.formName == 'ReviewForm' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ReviewForm' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ReviewForm' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ReviewForm' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  onChangeOrderBy(event): void {
    this.body.sortByField = event.value;
    this.getReviewFormData();
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    this.body.page = 1;
    if (inputValue.length == 0) {
      this.body.searchQuery = '';
      setTimeout(() => {
        this.getReviewFormData();
      }, 100);
    } else {
      this.body.searchQuery = inputValue;
      this.getReviewFormData();
    }
  }

  onSubmit() {
    if (!this.companyfilter.valid) {
      return;
    }
    this.body.page = 1;
    this.body.company_id = this.companyfilter.value.companyMasterID;
    this.getReviewFormData();
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.body.page = e.offset + 1;
      this.getReviewFormData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.body.limit = ev;
      this.limit = this.body.limit;
      this.getReviewFormData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/pms/reviewform/addReviewForm']);
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
          .callApi(this.constant.DELETEREVIEWFORM + id, {}, 'DELETE', true, true, true)
          .subscribe(
            (res: any) => {
              this.getReviewFormData();

              this.notifications.create('Done', res.message, NotificationType.Success, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
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

  clear() {
    this.companyfilter.resetForm();
    this.formValueStorageService.removeData('ListReviewFormComponent', false);
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
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
          this.handleError('Something Went Wrong!');
          this.spinner.stop('company');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('company');
      },
    );
  }

  onOptionSelect() {
    if (!this.selectedValue && this.selectedValue == null) {
      return;
    }
    this.spinner.start('a');
    this.api
      .callApi(
        this.constant.GETALLREVIEWFORM +
        this.query +
        `&exportFileType=${this.selectedValue}&exportData=true`,
        {},
        'GET',
        true,
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          if (this.selectedValue == 'csv') {
            var blob = new Blob([res], { type: 'text/csv' });
            saveAs(blob, 'Review Form.csv');
            this.selectedValue = null;
            this.spinner.stop('a');
          } else {
            var blob = new Blob([res], { type: 'text/xlsx' });
            saveAs(blob, 'Review Form.xlsx');
            this.selectedValue = null;
            this.spinner.stop('a');
          }
        },
        (err) => {
          this.selectedValue = null;
          this.handleError('Something Went Wrong!');
          this.spinner.stop('a');
        },
      );
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  viewReviewForm(rowData: any) {
    this.modalData = rowData;
  }


  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListReviewFormComponent',
      this.body,
      '/pms/reviewform/editReviewForm',
      rowData.id,
    );
  }

}
