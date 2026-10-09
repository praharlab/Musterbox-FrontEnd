import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfficeExpenseAdvanceRoutingModule } from './office-expense-advance-routing.module';
import { AddOfficeExpAdvanceComponent } from './add-office-exp-advance/add-office-exp-advance.component';
import { ListOfficeExpAdvanceComponent } from './list-office-exp-advance/list-office-exp-advance.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { CommonFilterModule } from '../../common-filter/common-filter.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [AddOfficeExpAdvanceComponent, ListOfficeExpAdvanceComponent],
  imports: [
    CommonModule,
    OfficeExpenseAdvanceRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    CommonFilterModule,
    NgSelectModule,
    NgxDatatableModule,
    PaginationModule,
    FormsModule
  ]
})
export class OfficeExpenseAdvanceModule { }
