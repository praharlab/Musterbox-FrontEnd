import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { ViewFinanceTransCommonComponent } from './view-finance-trans-common.component';
import { TabsModule } from 'ngx-bootstrap/tabs';



@NgModule({
  declarations: [ViewFinanceTransCommonComponent],
  imports: [
    CommonModule,
    NgxUiLoaderModule,
    ModalModule,
    TabsModule
  ],
  exports: [ViewFinanceTransCommonComponent]
})
export class ViewFinanceTransCommonModule { }
