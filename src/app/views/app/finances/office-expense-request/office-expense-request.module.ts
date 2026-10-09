import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfficeExpenseRequestRoutingModule } from './office-expense-request-routing.module';
import { ListOfficeExpRequestComponent } from './list-office-exp-request/list-office-exp-request.component';
import { FormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { ViewOfficeExpenseCommonModule } from '../view-office-expense-common/view-office-expense-common.module';


@NgModule({
  declarations: [ListOfficeExpRequestComponent],
  imports: [
    CommonModule,
    OfficeExpenseRequestRoutingModule,
    FormsModule,
    NgxUiLoaderModule,
    NgxDatatableModule,
    PaginationModule,
    TranslateModule,
    NgSelectModule,
    PagesContainersModule,
    ViewOfficeExpenseCommonModule
  ]
})
export class OfficeExpenseRequestModule { }
