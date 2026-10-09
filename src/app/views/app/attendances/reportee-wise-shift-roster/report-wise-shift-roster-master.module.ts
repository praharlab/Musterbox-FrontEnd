import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportWiseShiftRosterMasterRoutingModule } from './report-wise-shift-roster-master-routing.module';
import { ReporteeWiseShiftRosterComponent } from '../reportee-wise-shift-roster/reportee-wise-shift-roster.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ShiftRosterMasterModule } from '../shift-roster/shift-roster-master.module';
import { ImportReporteeWiseShiftRosterComponent } from '../import-reportee-wise-shift-roster/import-reportee-wise-shift-roster.component';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';


@NgModule({
  declarations: [ReporteeWiseShiftRosterComponent, ImportReporteeWiseShiftRosterComponent],
  imports: [
    CommonModule,
    ReportWiseShiftRosterMasterRoutingModule,
    NgxUiLoaderModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    SimpleNotificationsModule.forRoot(),
    ShiftRosterMasterModule,
    PagesContainersModule
  ]
})
export class ReportWiseShiftRosterMasterModule { }
