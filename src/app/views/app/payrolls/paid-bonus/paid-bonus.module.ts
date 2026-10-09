import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaidBonusComponent } from './paid-bonus.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';



@NgModule({
  declarations: [PaidBonusComponent],
  imports: [
    CommonModule,
    PaginationModule
  ],
  exports: [PaidBonusComponent]
})
export class PaidBonusModule { }
