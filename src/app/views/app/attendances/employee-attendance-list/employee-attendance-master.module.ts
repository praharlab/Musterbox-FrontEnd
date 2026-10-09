import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeAttendanceMasterRoutingModule } from './employee-attendance-master-routing.module';
import { EmployeeAttendanceListComponent } from './employee-attendance-list.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [EmployeeAttendanceListComponent],
  imports: [
    CommonModule,
    EmployeeAttendanceMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    CommonFilterModule
  ]
})
export class EmployeeAttendanceMasterModule { }
