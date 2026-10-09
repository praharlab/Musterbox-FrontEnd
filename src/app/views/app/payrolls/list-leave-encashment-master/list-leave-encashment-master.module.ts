import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListLeaveEncashmentMasterComponent } from './list-leave-encashment-master.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';



@NgModule({
  declarations: [ListLeaveEncashmentMasterComponent],
  imports: [
    CommonModule,
    NgxUiLoaderModule,
    NgxDatatableModule,
    PaginationModule
  ],
  exports: [ListLeaveEncashmentMasterComponent]
})
export class ListLeaveEncashmentMasterModule { }
