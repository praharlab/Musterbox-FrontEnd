import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListAddLeaveBalanceMasterComponent } from './list-add-leave-balance-master.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';



@NgModule({
  declarations: [ListAddLeaveBalanceMasterComponent],
  imports: [
    CommonModule,
    NgxUiLoaderModule,
    NgxDatatableModule,
    PaginationModule
  ],
  exports: [ListAddLeaveBalanceMasterComponent]
})
export class ListAddLeaveBalanceMasterModule { }
