import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaxRebateRoutingModule } from './tax-rebate-routing.module';
import { ListTaxRebateComponent } from './list-tax-rebate/list-tax-rebate.component';
import { AddTaxRebateComponent } from './add-tax-rebate/add-tax-rebate.component';
import { EditTaxRebateComponent } from './edit-tax-rebate/edit-tax-rebate.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';


@NgModule({
  declarations: [ListTaxRebateComponent, AddTaxRebateComponent, EditTaxRebateComponent],
  imports: [
    CommonModule,
    TaxRebateRoutingModule,
    FormsModule,
    NgSelectModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule
  ]
})
export class TaxRebateModule { }
