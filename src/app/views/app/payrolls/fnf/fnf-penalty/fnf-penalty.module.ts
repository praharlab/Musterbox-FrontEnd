import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FnfPenaltyComponent } from './fnf-penalty.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
  declarations: [FnfPenaltyComponent],
  imports: [
    CommonModule,
    ModalModule,
    FormsModule,
    NgSelectModule
  ],
  exports: [FnfPenaltyComponent]
})
export class FnfPenaltyModule { }
