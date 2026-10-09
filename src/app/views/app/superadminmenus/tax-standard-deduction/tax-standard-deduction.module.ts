import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaxStandardDeductionRoutingModule } from './tax-standard-deduction-routing.module';
import { ListTaxStandardDeductionComponent } from './list-tax-standard-deduction/list-tax-standard-deduction.component';
import { AddTaxStandardDeductionComponent } from './add-tax-standard-deduction/add-tax-standard-deduction.component';
import { EditTaxStandardDeductionComponent } from './edit-tax-standard-deduction/edit-tax-standard-deduction.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';


@NgModule({
  declarations: [ListTaxStandardDeductionComponent, AddTaxStandardDeductionComponent, EditTaxStandardDeductionComponent],
  imports: [
    CommonModule,
    TaxStandardDeductionRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    NgxDatatableModule,
    PaginationModule
  ]
})
export class TaxStandardDeductionModule { }
