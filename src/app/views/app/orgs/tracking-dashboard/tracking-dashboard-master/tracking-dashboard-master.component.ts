import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonFilterButtonFields, CommonFilterFields } from 'src/app/constants/CommonFilterFields';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { OutsideTrackingComponent } from '../outside-tracking/outside-tracking.component';
import { InsideTrackingComponent } from '../inside-tracking/inside-tracking.component';
import { OfflineTrackingComponent } from '../offline-tracking/offline-tracking.component';
import { GpsOffTrackingComponent } from '../gps-off-tracking/gps-off-tracking.component';

@Component({
    selector: 'app-tracking-dashboard-master',
    templateUrl: './tracking-dashboard-master.component.html',
    styleUrls: ['./tracking-dashboard-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TrackingDashboardMasterComponent implements OnInit {

  @ViewChild(OutsideTrackingComponent) outsideTrackingComponent: OutsideTrackingComponent;
  @ViewChild(InsideTrackingComponent) insideTrackingComponent: InsideTrackingComponent;
  @ViewChild(OfflineTrackingComponent) offlineTrackingComponent: OfflineTrackingComponent;
  @ViewChild(GpsOffTrackingComponent) gpsOffTrackingComponent: GpsOffTrackingComponent;

  hideFilters: CommonFilterFields[] = [
    CommonFilterFields.Status,
    CommonFilterFields.Department,
    CommonFilterFields.Designation,
    CommonFilterFields.Division,
    CommonFilterFields.EmployementType,
    CommonFilterFields.Project,
    CommonFilterFields.SalaryType,
    CommonFilterFields.SkillCategory,
    CommonFilterFields.User,
    CommonFilterFields.WorkingArea
  ];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit];

  filterData = {
    companyMasterID: null,
    branchMasterID: null
  }

  permissionview: any = [];
  trackingUserDetails: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private commonNotificationService: CommonNotificationService,
  ) { }

  ngOnInit(): void {
    this.checkpermission();
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
              permissionval.formName == 'TrackingDashboard' && permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  onSubmit(val: any) {
    this.filterData.companyMasterID = val?.company;
    this.filterData.branchMasterID = val?.branch ? val.branch : null;

    this.getTrackingUserDetails();
    setTimeout(() => {
      this.callChildComponentData();
    });
  }

  getCompany(companyMasterID: number) {
    this.filterData.companyMasterID = companyMasterID;
    this.getTrackingUserDetails();
    setTimeout(() => {
      this.callChildComponentData();
    });
  }

  getTrackingUserDetails() {
    this.spinner.start('trackingDetails');
    this.api
      .callApi(this.constant.GETACTIVEUSERANDTRACKINGCOUNT, this.filterData, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.trackingUserDetails = res.data;
            this.spinner.stop('trackingDetails');
          } else {
            this.commonNotificationService.handleWarning(res.message);
            this.spinner.stop('trackingDetails');
          }
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('trackingDetails');
        },
      );
  }

  callChildComponentData(){
    if(this.outsideTrackingComponent){
      this.outsideTrackingComponent.filterData.companyMasterID = this.filterData.companyMasterID;
      this.outsideTrackingComponent.filterData.branchMasterID = this.filterData.branchMasterID;
      this.outsideTrackingComponent?.getOutsideTrackingUsers();
    }

    if(this.insideTrackingComponent){
      this.insideTrackingComponent.filterData.companyMasterID = this.filterData.companyMasterID;
      this.insideTrackingComponent.filterData.branchMasterID = this.filterData.branchMasterID;
      this.insideTrackingComponent?.getInsideTrackingUsers();
    }

    if(this.offlineTrackingComponent){
      this.offlineTrackingComponent.filterData.companyMasterID = this.filterData.companyMasterID;
      this.offlineTrackingComponent.filterData.branchMasterID = this.filterData.branchMasterID;
      this.offlineTrackingComponent?.getOfflineUsers();
    }

    if(this.gpsOffTrackingComponent){
      this.gpsOffTrackingComponent.filterData.companyMasterID = this.filterData.companyMasterID;
      this.gpsOffTrackingComponent.filterData.branchMasterID = this.filterData.branchMasterID;
      this.gpsOffTrackingComponent?.getGpsOffData();
    }
  }

}
