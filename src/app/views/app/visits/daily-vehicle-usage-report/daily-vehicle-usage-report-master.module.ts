import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DailyVehicleUsageReportMasterRoutingModule } from './daily-vehicle-usage-report-master-routing.module';
import { DailyVehicleUsageReportComponent } from './daily-vehicle-usage-report.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { AgmDirectionModule } from 'src/app/components/agm/agm.module';
import { AgmCoreModule } from 'src/app/components/agm/agm.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [DailyVehicleUsageReportComponent],
  imports: [
    CommonModule,
    DailyVehicleUsageReportMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    LayoutContainersModule,
    AgmDirectionModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAQyXIWhOoRo6rj0PcaYdEbVTSiu2EHiq4',
    }),
    TabsModule,
    ComponentsStateButtonModule,
    SimpleNotificationsModule.forRoot(),
    CommonFilterModule
  ]
})
export class DailyVehicleUsageReportMasterModule { }
