import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BankStatementFormatRoutingModule } from './bank-statement-format-routing.module';
import { BankStatementFormatComponent } from './bank-statement-format/bank-statement-format.component';
import { CommonFilterModule } from '../../common-filter/common-filter.module';
import { CreateBankStatementFormatComponent } from './create-bank-statement-format/create-bank-statement-format.component';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { EditBankStatementFormatComponent } from './edit-bank-statement-format/edit-bank-statement-format.component';


@NgModule({
  declarations: [BankStatementFormatComponent, CreateBankStatementFormatComponent, EditBankStatementFormatComponent],
  imports: [
    CommonModule,
    BankStatementFormatRoutingModule,
    CommonFilterModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    NgxUiLoaderModule,
    NgxDatatableModule,
    PaginationModule
  ]
})
export class BankStatementFormatModule { }
