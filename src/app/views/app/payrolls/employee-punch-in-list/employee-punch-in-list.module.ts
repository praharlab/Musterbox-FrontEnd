import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeePunchInListComponent } from './employee-punch-in-list.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [EmployeePunchInListComponent],
  imports: [
    CommonModule,
    NgxUiLoaderModule,
    ModalModule,
    NgxDatatableModule,
    PaginationModule,
    NgSelectModule,
    FormsModule
  ],
  exports: [EmployeePunchInListComponent]
})
export class EmployeePunchInListModule { }
