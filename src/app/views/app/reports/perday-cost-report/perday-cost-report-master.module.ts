import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerdayCostReportMasterRoutingModule } from './perday-cost-report-master-routing.module';
import { PerdayCostReportComponent } from './perday-cost-report.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [PerdayCostReportComponent],
  imports: [
    CommonModule,
    PerdayCostReportMasterRoutingModule,
    NgxUiLoaderModule,
    SimpleNotificationsModule.forRoot(),
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
  ]
})
export class PerdayCostReportMasterModule { }
