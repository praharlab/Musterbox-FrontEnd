import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserSkillsetsReportMasterRoutingModule } from './user-skillsets-report-master-routing.module';
import { UserSkillsetsReportComponent } from './user-skillsets-report.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [UserSkillsetsReportComponent],
  imports: [
    CommonModule,
    UserSkillsetsReportMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    SimpleNotificationsModule.forRoot(),
    CommonFilterModule
  ]
})
export class UserSkillsetsReportMasterModule { }
