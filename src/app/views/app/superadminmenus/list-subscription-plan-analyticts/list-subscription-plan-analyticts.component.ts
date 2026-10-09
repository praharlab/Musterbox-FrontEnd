import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { saveAs } from 'file-saver';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-subscription-plan-analyticts',
    templateUrl: './list-subscription-plan-analyticts.component.html',
    styleUrls: ['./list-subscription-plan-analyticts.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListSubscriptionPlanAnalytictsComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;

  body = {
    page: 1,
    limit: 10,
    searchQuery: '',
    productMasterID: null,
    exportData: false,
  };

  page = {
    totalCount: 0,
    offset: 0,
  };

  limit = 10;
  formValue: any;
  dashboardRows: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private notifications: AppNotificationService,
    private formValueStorageService: FormValueStorageService,
  ) {}

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();

    this.body.productMasterID = this.formValue.SubscriptionPlanAnalytictsComponent.id;

    this.getCompanySubscriptionPlanAnalyticsDataProductWise();
    this.getCompanySubscriptionPlanAnalyticsData();
  }

  getCompanySubscriptionPlanAnalyticsDataProductWise() {
    this.spinner.start('card');
    this.api
      .callApi(
        this.constant.GETCOMPANYSUBSCRIPTIONPLANANALYTICSDATAPRODUCTWISE +
          `?productMasterID=${this.body.productMasterID}`,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.dashboardRows = res.data;
            this.spinner.stop('card');
          } else {
            this.handleError(res.message);
            this.spinner.stop('card');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('card');
        },
      );
  }

  getCompanySubscriptionPlanAnalyticsData() {
    this.spinner.start('start');
    this.api
      .callApi(
        this.constant.LISTCOMPANYSUBSCRIPTIONPLANANALYTICSDATA,
        this.body,
        'POST',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.temp = [...this.rows];
            this.page.totalCount = res.totalcount;

            this.spinner.stop('start');
          } else {
            this.handleError(res.message);
            this.spinner.stop('start');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.body.searchQuery = '';
      setTimeout(() => {
        this.getCompanySubscriptionPlanAnalyticsData();
      }, 100);
    } else {
      this.body.searchQuery = inputValue;
      this.getCompanySubscriptionPlanAnalyticsData();
    }
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.body.page = e.offset + 1;
      this.getCompanySubscriptionPlanAnalyticsData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.body.limit = ev;
      this.limit = this.body.limit;
      this.getCompanySubscriptionPlanAnalyticsData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  downloadFile() {
    this.spinner.start('a');

    this.body.exportData = true;
    this.api
      .callApi(
        this.constant.LISTCOMPANYSUBSCRIPTIONPLANANALYTICSDATA,
        this.body,
        'POST',
        true,
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          var blob = new Blob([res], { type: 'text/xlsx' });
          saveAs(blob, 'Company SubscriptionPlan Data.xlsx');
          this.body.exportData = false;
          this.spinner.stop('a');
        },
        (err) => {
          this.handleError('Something Went Wrong!');
          this.body.exportData = false;
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
}
