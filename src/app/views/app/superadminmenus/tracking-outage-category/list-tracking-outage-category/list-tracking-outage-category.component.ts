import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { environment } from 'src/environments/environment';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-tracking-outage-category',
    templateUrl: './list-tracking-outage-category.component.html',
    styleUrls: ['./list-tracking-outage-category.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListTrackingOutageCategoryComponent implements OnInit {

  adminRoot = environment.adminRoot;
  rows: any = [];
  usertype: any;

  filterData = {
    page: 1,
    limit: 10,
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  temp = [];
  itemsPerPage = 10;

  itemOptionsPerPage = ItemOptionsPerPageArray;
  limit = 10;
  currentPage: number;

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
          '/app/superadminmenus/superadmin',
          '/app/superadminmenus/edit_superadmin',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListSuperadminComponent', false);
        }
      }
    });
  }

  ngOnInit(): void {
    this.getTrackingOutageCategories()
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.formValueStorageService.removeData('ListSuperadminComponent', false);
    } else {
      this.getTrackingOutageCategories();
    }
  }

  getTrackingOutageCategories() {
    this.spinner.start('data');
    this.api
      .callApi(this.constant.GETTRACKINGOUTAGECATEGORIES, this.filterData, 'POST', true, false, true)
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
            this.spinner.stop('data');
          } else {
            this.handleError(res.message);
            this.spinner.stop('data');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('data');
        },
      );
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getTrackingOutageCategories();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  navigateToAddPage() {
    this.router.navigate([this.adminRoot + '/superadminmenus/tracking-outage-category/addTrackingOutageCategory']);
  }

  onPageChange(val) {
    this.filterData.page = val.page
    this.getTrackingOutageCategories()
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListTrackingOutageCategoryComponent',
      this.filterData,
      '/superadminmenus/tracking-outage-category/editTrackingOutageCategory',
      rowData.trackingCategoryID,
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
        this.spinner.start('confirm');
        this.api
          .callApi(this.constant.DELETETRACKINGOUTAGECATEGORIES + '/' + id, {}, 'DELETE', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });
                this.getTrackingOutageCategories();
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

  alertActiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Category will active!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, active it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          trackingCategoryID: id,
          status: 1,
        };
        this.spinner.start('active');
        this.api
          .callApi(this.constant.UPDATETRACKINGOUTAGECATEGORYSTATUS, body, 'PUT', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              this.getTrackingOutageCategories();
              setTimeout(() => {
                this.spinner.stop('active');
              }, 3000);
            },
            (err) => {
              this.handleError(err.error.message);
              setTimeout(() => {
                this.spinner.stop('active');
              }, 3000);
            },
          );
      }
    });
  }

  alertDeactiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Category will deactive!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, Deactive it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          trackingCategoryID: id,
          status: 0,
        };
        this.spinner.start('deactive');
        this.api
          .callApi(this.constant.UPDATETRACKINGOUTAGECATEGORYSTATUS, body, 'PUT', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              this.getTrackingOutageCategories();
              setTimeout(() => {
                this.spinner.stop('deactive');
              }, 3000);
            },
            (err) => {
              this.handleError(err.error.message);
              setTimeout(() => {
                this.spinner.stop('deactive');
              }, 3000);
            },
          );
      }
    });
  }

}
