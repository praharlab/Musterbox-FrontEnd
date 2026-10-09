import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfficeExpenseRoutingModule } from './office-expense-routing.module';
import { ListOfficeExpenseComponent } from './list-office-expense/list-office-expense.component';
import { AddOfficeExpenseComponent } from './add-office-expense/add-office-expense.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonFilterModule } from '../../common-filter/common-filter.module';
import { ViewOfficeExpenseCommonModule } from '../view-office-expense-common/view-office-expense-common.module';
import { EditOfficeExpenseComponent } from './edit-office-expense/edit-office-expense.component';
import { ReapplyOfficeExpenseComponent } from './reapply-office-expense/reapply-office-expense.component';

@NgModule({
  declarations: [ListOfficeExpenseComponent, AddOfficeExpenseComponent, EditOfficeExpenseComponent, ReapplyOfficeExpenseComponent],
  imports: [
    CommonModule,
    OfficeExpenseRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgSelectModule,
    NgxDatatableModule,
    PaginationModule,
    TranslateModule,
    FormsModule,
    CommonFilterModule,
    ViewOfficeExpenseCommonModule
  ]
})
export class OfficeExpenseModule { }
