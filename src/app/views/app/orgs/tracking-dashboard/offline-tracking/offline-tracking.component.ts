import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-offline-tracking',
    templateUrl: './offline-tracking.component.html',
    styleUrls: ['./offline-tracking.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class OfflineTrackingComponent implements OnInit {
@ViewChild(DatatableComponent) table: DatatableComponent;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: null,
    branchMasterID: null,
    type:'offline'
  }
  page = {
    totalCount: 0,
    offset: 0,
  };

  apiURL = environment.apiUrl;

  currentPage: any

  ColumnMode = ColumnMode.force;

  rows: any = []

  itemOptionsPerPage = ItemOptionsPerPageArray;
  showloader: boolean = false;

  constructor(
      private spinner: NgxUiLoaderService,
      private api: ApiService,
      private constant: ConstantService,
      private commonNotificationService: CommonNotificationService,
    ) { }

  ngOnInit(): void {
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.getOfflineUsers();
    } else {
      this.commonNotificationService.handleError("Something went wrong!");
    }
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getOfflineUsers();
    } else {
      this.commonNotificationService.handleError("Something went wrong!");
    }
  }

  getOfflineUsers() {
    this.showloader = true;
    this.api
      .callApi(this.constant.GETTRACKINGGEOFENCEWISEDATA, this.filterData, 'POST', false, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.page.totalCount = res.totalcount;
            this.showloader = false;
            setTimeout(() => {
              this.currentPage = this.filterData.page
            }, 100);
          } else {
            this.commonNotificationService.handleWarning(res.message);
            this.showloader = false;
          }
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.showloader = false;
        },
      );
  }

}
