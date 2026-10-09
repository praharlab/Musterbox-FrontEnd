import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamDailyReportingMasterRoutingModule } from './team-daily-reporting-master-routing.module';
import { TeamDailyReportComponent } from './team-daily-reporting.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [TeamDailyReportComponent],
  imports: [
    CommonModule,
    TeamDailyReportingMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class TeamDailyReportingMasterModule { }
