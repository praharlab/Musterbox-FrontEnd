import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-tracking-outage-category-details',
    templateUrl: './list-tracking-outage-category-details.component.html',
    styleUrls: ['./list-tracking-outage-category-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListTrackingOutageCategoryDetailsComponent implements OnInit {

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
    public activatedRoute: ActivatedRoute,
    private formValueStorageService: FormValueStorageService,
  ) { }

  ngOnInit(): void {
    this.getTrackingOutageCategoryDetails()
  }

  getTrackingOutageCategoryDetails() {
    this.spinner.start('data');
    this.api
      .callApi(this.constant.GETTRACKINGCATEGORYDETAILS, this.filterData, 'POST', true, false, true)
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
      this.getTrackingOutageCategoryDetails();
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
    this.router.navigate([this.adminRoot + '/superadminmenus/tracking-outage-category-details/addTrackingOutageCategoryDetails']);
  }

  onPageChange(val) {
    this.filterData.page = val.page
    this.getTrackingOutageCategoryDetails()
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListTrackingOutageCategoryDetailsComponent',
      this.filterData,
      '/superadminmenus/tracking-outage-category-details/editTrackingOutageCategoryDetails',
      rowData.categoryDetailsID,
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
          .callApi(this.constant.DELETETRACKINGCATEGORYDETAILS + '/' + id, {}, 'DELETE', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });
                this.getTrackingOutageCategoryDetails();
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
          categoryDetailsID: id,
          status: 1,
        };
        this.spinner.start('active');
        this.api
          .callApi(this.constant.UPDATETRACKINGCATEGORYDETAILSSTATUS, body, 'PUT', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              this.getTrackingOutageCategoryDetails();
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
          categoryDetailsID: id,
          status: 0,
        };
        this.spinner.start('deactive');
        this.api
          .callApi(this.constant.UPDATETRACKINGCATEGORYDETAILSSTATUS, body, 'PUT', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              this.getTrackingOutageCategoryDetails();
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