import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendanceSummaryMasterRoutingModule } from './attendance-summary-master-routing.module';
import { MyattendanceSummaryComponent } from './myattendance-summary.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [MyattendanceSummaryComponent],
  imports: [
    CommonModule,
    AttendanceSummaryMasterRoutingModule,
    NgxUiLoaderModule,
    LayoutContainersModule,
    FormsModule,
    TranslateModule
  ]
})
export class AttendanceSummaryMasterModule { }
