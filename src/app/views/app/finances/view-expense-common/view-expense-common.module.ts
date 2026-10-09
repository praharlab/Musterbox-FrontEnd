import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewExpenseCommonComponent } from './view-expense-common.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AccordionModule } from 'ngx-bootstrap/accordion';



@NgModule({
  declarations: [ViewExpenseCommonComponent],
  imports: [
    CommonModule,
    ModalModule,
    TabsModule,
    NgxUiLoaderModule,
    FormsModule,
    TranslateModule,
    AccordionModule
  ],
  exports: [ViewExpenseCommonComponent]
})
export class ViewExpenseCommonModule { }
