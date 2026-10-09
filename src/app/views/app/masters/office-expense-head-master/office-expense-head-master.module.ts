import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfficeExpenseHeadMasterRoutingModule } from './office-expense-head-master-routing.module';
import { ListOfficeExpenseHeadComponent } from './list-office-expense-head/list-office-expense-head.component';
import { CommonFilterModule } from '../../common-filter/common-filter.module';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AddOfficeExpenseHeadComponent } from './add-office-expense-head/add-office-expense-head.component';
import { EditOfficeExpenseHeadComponent } from './edit-office-expense-head/edit-office-expense-head.component';
import { ImportOfficeExpenseHeadComponent } from './import-office-expense-head/import-office-expense-head.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [ListOfficeExpenseHeadComponent, AddOfficeExpenseHeadComponent, EditOfficeExpenseHeadComponent, ImportOfficeExpenseHeadComponent],
  imports: [
    CommonModule,
    OfficeExpenseHeadMasterRoutingModule,
    CommonFilterModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    NgxUiLoaderModule,
    NgxDatatableModule,
    PaginationModule,
    TranslateModule
  ]
})
export class OfficeExpenseHeadMasterModule { }
