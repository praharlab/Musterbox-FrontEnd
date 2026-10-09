import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsRoutingModule } from './analytics-routing.module';
import { AnalyticsComponent } from './analytics.component';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { DashboardsContainersModule } from 'src/app/containers/dashboards/dashboards.containers.module';


@NgModule({
  declarations: [
    AnalyticsComponent,
  ],
  imports: [
    CommonModule,
    AnalyticsRoutingModule,
    LayoutContainersModule,
    DashboardsContainersModule
  ]
})
export class AnalyticsModule { }
