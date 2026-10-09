import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkillsetsReportMasterRoutingModule } from './skillsets-report-master-routing.module';
import { SkillsetsReportComponent } from './skillsets-report.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [SkillsetsReportComponent],
  imports: [
    CommonModule,
    SkillsetsReportMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class SkillsetsReportMasterModule { }
