import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfficeExpenseCategoryMasterRoutingModule } from './office-expense-category-master-routing.module';
import { ListOfficeExpenseCategoryComponent } from './list-office-expense-category/list-office-expense-category.component';
import { CommonFilterModule } from '../../common-filter/common-filter.module';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AddOfficeExpenseCategoryComponent } from './add-office-expense-category/add-office-expense-category.component';
import { EditOfficeExpenseCategoryComponent } from './edit-office-expense-category/edit-office-expense-category.component';
import { ImportOfficeExpenseCategoryComponent } from './import-office-expense-category/import-office-expense-category.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [ListOfficeExpenseCategoryComponent, AddOfficeExpenseCategoryComponent, EditOfficeExpenseCategoryComponent, ImportOfficeExpenseCategoryComponent],
  imports: [
    CommonModule,
    OfficeExpenseCategoryMasterRoutingModule,
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
export class OfficeExpenseCategoryMasterModule { }
