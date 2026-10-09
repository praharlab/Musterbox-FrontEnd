import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeSalaryStructureRoutingModule } from './employee-salary-structure-routing.module';
import { EmployeeSalaryStructureComponent } from './employee-salary-structure.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [EmployeeSalaryStructureComponent],
  imports: [
    CommonModule,
    EmployeeSalaryStructureRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot(),
    CommonFilterModule
  ]
})
export class EmployeeSalaryStructureModule { }
