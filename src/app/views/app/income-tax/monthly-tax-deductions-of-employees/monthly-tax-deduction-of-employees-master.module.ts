import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonthlyTaxDeductionOfEmployeesMasterRoutingModule } from './monthly-tax-deduction-of-employees-master-routing.module';
import { MonthlyTaxDeductionsOfEmployeesComponent } from './monthly-tax-deductions-of-employees.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationModule } from 'ngx-bootstrap/pagination';


@NgModule({
  declarations: [MonthlyTaxDeductionsOfEmployeesComponent],
  imports: [
    CommonModule,
    MonthlyTaxDeductionOfEmployeesMasterRoutingModule,
    NgxUiLoaderModule,
    SimpleNotificationsModule.forRoot(),
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    PaginationModule
  ]
})
export class MonthlyTaxDeductionOfEmployeesMasterModule { }
