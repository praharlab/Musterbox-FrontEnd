import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FnfLoanComponent } from './fnf-loan.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
  declarations: [FnfLoanComponent],
  imports: [
    CommonModule,
    ModalModule,
    FormsModule,
    NgSelectModule
  ],
  exports: [FnfLoanComponent]
})
export class FnfLoanModule { }
