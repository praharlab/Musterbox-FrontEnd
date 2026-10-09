import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrackingDashboardRoutingModule } from './tracking-dashboard-routing.module';
import { TrackingDashboardMasterComponent } from './tracking-dashboard-master/tracking-dashboard-master.component';
import { CommonFilterModule } from '../../common-filter/common-filter.module';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { OutsideTrackingModule } from './outside-tracking/outside-tracking.module';
import { OfflineTrackingModule } from './offline-tracking/offline-tracking.module';
import { InsideTrackingModule } from './inside-tracking/inside-tracking.module';
import { GpsOffTrackingModule } from './gps-off-tracking/gps-off-tracking.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';


@NgModule({
  declarations: [TrackingDashboardMasterComponent],
  imports: [
    CommonModule,
    TrackingDashboardRoutingModule,
    CommonFilterModule,
    PagesContainersModule,
    FormsModule,
    OutsideTrackingModule,
    OfflineTrackingModule,
    InsideTrackingModule,
    GpsOffTrackingModule,
    NgxUiLoaderModule
  ]
})
export class TrackingDashboardModule { }
