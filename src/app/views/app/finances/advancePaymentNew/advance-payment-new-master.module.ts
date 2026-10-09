import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdvancePaymentNewMasterRoutingModule } from './advance-payment-new-master-routing.module';
import { ListAdvancePaymentNewComponent } from './list-advance-payment-new/list-advance-payment-new.component';
import { AddReqAdvPayComponent } from './add-req-adv-pay/add-req-adv-pay.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [ListAdvancePaymentNewComponent, AddReqAdvPayComponent],
  imports: [
    CommonModule,
    AdvancePaymentNewMasterRoutingModule,
    NgxUiLoaderModule,
    SimpleNotificationsModule.forRoot(),
    PagesContainersModule,
    NgSelectModule,
    FormsModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule
  ]
})
export class AdvancePaymentNewMasterModule { }
