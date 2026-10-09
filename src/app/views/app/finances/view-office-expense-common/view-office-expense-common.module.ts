import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewOfficeExpenseCommonComponent } from './view-office-expense-common.component';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';



@NgModule({
  declarations: [ViewOfficeExpenseCommonComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgxUiLoaderModule,
    TranslateModule,
    ModalModule
  ],
  exports: [ViewOfficeExpenseCommonComponent]
})
export class ViewOfficeExpenseCommonModule { }
