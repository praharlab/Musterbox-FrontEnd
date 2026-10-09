import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
    selector: 'app-list-tax-rebate',
    templateUrl: './list-tax-rebate.component.html',
    styleUrls: ['./list-tax-rebate.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListTaxRebateComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;

  filterData: any = {
    page: 1,
    limit: 10,
  }

  adminRoot = environment.adminRoot;
  usertype: any
  itemOptionsPerPage = ItemOptionsPerPageArray;
  rows: any = []

  page = {
    totalCount: 0,
    offset: 0,
  };

  formValue: any

  currentPage: number;

  permissioncreate: any = [];
  permissionview: any = [];
  permissionedit: any = [];
  permissiondelete: any = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,
    private formValueStorageService: FormValueStorageService,
    private router: Router,
    private commonNotificationService: CommonNotificationService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/superadminmenus/tax-rebate',
          this.adminRoot + '/superadminmenus/tax-rebate/edit',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeComponentData('ListTaxRebateComponent', false);
        }
      }
    });
  }

  ngOnInit(): void {
    this.usertype = localStorage.getItem('usertype')
    if (this.usertype == 2) {
      this.permissioncreate = [1];
      this.permissionedit = [1];
      this.permissionview = [1];
      this.permissiondelete = [1];
    }

    this.formValue = this.formValueStorageService.getData();

    if (this.formValueStorageService.isEmptyObject('ListTaxRebateComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
      };
    } else {
      this.filterData = this.formValue.ListTaxRebateComponent.body;
    }
    this.getAllData()
  }

  onLimitChange(ev: any) {
    this.filterData.limit = ev;
    this.getAllData();
  }

  getAllData() {
    this.spinner.start('getAll');
    this.api
      .callApi(this.constant.LISTTAXREBATE, this.filterData, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.filterData.page;
          });
        }
        this.spinner.stop('getAll');
      }, (error) => {
        this.commonNotificationService.handleError(error.error.message);
        this.spinner.stop('getAll');
      });
  }

  navigateToAddPage() {
    this.router.navigate([this.adminRoot + '/superadminmenus/tax-rebate/add']);
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.filterData.search = '';
      setTimeout(() => {
        this.getAllData();
      }, 100);
    } else {
      this.filterData.search = inputValue;
      this.getAllData();
    }
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListTaxRebateComponent',
      this.filterData,
      '/superadminmenus/tax-rebate/edit',
      rowData.id,
    );
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
        this.spinner.start('delete');
        this.api
          .callApi(
            this.constant.DELETETAXREBATE + id,
            {},
            'DELETE',
            true,
            true,
            true,
          )
          .subscribe(
            (res: any) => {
              this.getAllData();
              this.commonNotificationService.handleSuccess(res.message);
              this.spinner.stop('delete');
            },
            (err) => {
              this.commonNotificationService.handleError(err.error.message)
              this.spinner.stop('delete');
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
      this.commonNotificationService.handleError('Something Went Wrong!');
    }
  }
}
