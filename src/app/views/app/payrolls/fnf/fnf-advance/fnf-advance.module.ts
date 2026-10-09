import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FnfAdvanceComponent } from './fnf-advance.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
  declarations: [FnfAdvanceComponent],
  imports: [
    CommonModule,
    ModalModule,
    FormsModule,
    NgSelectModule
  ],
  exports: [FnfAdvanceComponent]
})
export class FnfAdvanceModule { }
