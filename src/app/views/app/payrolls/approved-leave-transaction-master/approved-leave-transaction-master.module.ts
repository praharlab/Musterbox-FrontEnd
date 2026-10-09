import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApprovedLeaveTransactionMasterComponent } from './approved-leave-transaction-master.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';



@NgModule({
declarations: [ApprovedLeaveTransactionMasterComponent],
  imports: [
    CommonModule,
    NgxUiLoaderModule,
    NgxDatatableModule,
    PaginationModule
  ],
  exports: [ApprovedLeaveTransactionMasterComponent]
})
export class ApprovedLeaveTransactionMasterModule { }
