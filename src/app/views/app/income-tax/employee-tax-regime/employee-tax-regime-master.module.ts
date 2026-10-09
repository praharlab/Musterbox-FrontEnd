import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeTaxRegimeMasterRoutingModule } from './employee-tax-regime-master-routing.module';
import { ListEmployeeTaxRegimeComponent } from './list-employee-tax-regime/list-employee-tax-regime.component';
import { AddEmployeeTaxRegimeComponent } from './add-employee-tax-regime/add-employee-tax-regime.component';
import { EditEmployeeTaxRegimeComponent } from './edit-employee-tax-regime/edit-employee-tax-regime.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [ListEmployeeTaxRegimeComponent, AddEmployeeTaxRegimeComponent, EditEmployeeTaxRegimeComponent],
  imports: [
    CommonModule,
    EmployeeTaxRegimeMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot(),
    CommonFilterModule
  ]
})
export class EmployeeTaxRegimeMasterModule { }
