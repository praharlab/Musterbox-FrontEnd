import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OutsideAttendanceMasterRoutingModule } from './outside-attendance-master-routing.module';
import { MyOutsideAttendanceComponent } from './my-outside-attendance.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';


@NgModule({
  declarations: [MyOutsideAttendanceComponent],
  imports: [
    CommonModule,
    OutsideAttendanceMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
  ]
})
export class OutsideAttendanceMasterModule { }
