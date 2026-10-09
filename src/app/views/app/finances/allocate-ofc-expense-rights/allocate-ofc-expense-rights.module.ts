import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllocateOfcExpenseRightsRoutingModule } from './allocate-ofc-expense-rights-routing.module';
import { ListAllocateOfcExpenseRightsComponent } from './list-allocate-ofc-expense-rights/list-allocate-ofc-expense-rights.component';
import { AddAllocateOfcExpenseRightsComponent } from './add-allocate-ofc-expense-rights/add-allocate-ofc-expense-rights.component';
import { EditAllocateOfcExpenseRightsComponent } from './edit-allocate-ofc-expense-rights/edit-allocate-ofc-expense-rights.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { CommonFilterModule } from '../../common-filter/common-filter.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';


@NgModule({
  declarations: [ListAllocateOfcExpenseRightsComponent, AddAllocateOfcExpenseRightsComponent, EditAllocateOfcExpenseRightsComponent],
  imports: [
    CommonModule,
    AllocateOfcExpenseRightsRoutingModule,
    FormsModule,
    NgSelectModule,
    NgxDatatableModule,
    PaginationModule,
    TranslateModule,
    CommonFilterModule,
    NgxUiLoaderModule,
    PagesContainersModule
  ]
})
export class AllocateOfcExpenseRightsModule { }
