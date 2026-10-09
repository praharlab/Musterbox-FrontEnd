import { Component, Input, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-outside-tracking',
    templateUrl: './outside-tracking.component.html',
    styleUrls: ['./outside-tracking.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class OutsideTrackingComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: null,
    branchMasterID: null,
    type: 'out'
  }
  page = {
    totalCount: 0,
    offset: 0,
  };

  apiURL = environment.apiUrl;

  currentPage: any

  ColumnMode = ColumnMode.force;

  rows: any = []
  permissionview: any = []

  itemOptionsPerPage = ItemOptionsPerPageArray;
  showloader: boolean = false;

  constructor(
      private spinner: NgxUiLoaderService,
      private api: ApiService,
      private constant: ConstantService,
      private commonNotificationService: CommonNotificationService,
      private formValueStorageService: FormValueStorageService,
    ) { }

  ngOnInit(): void {
    this.checkpermission()
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.getOutsideTrackingUsers();
    } else {
      this.commonNotificationService.handleError("Something went wrong!");
    }
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getOutsideTrackingUsers();
    } else {
      this.commonNotificationService.handleError("Something went wrong!");
    }
  }

  getOutsideTrackingUsers() {
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

  navigateToViewPage(userMasterID: number) {
    if (userMasterID)
      this.formValueStorageService.addData(
        'commonFilterData',
        {
          user: userMasterID,
          selectedDate: new Date().toISOString().split('T')[0]
        }
      );
    this.formValueStorageService.navigate(
      'TrackingDashboardComponent',
      {},
      '/orgs/team_location_tracking',
      userMasterID,
    )
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
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AdminLocationTracking' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

}
