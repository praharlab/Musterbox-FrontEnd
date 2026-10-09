import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PendingBonusComponent } from './pending-bonus.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';



@NgModule({
  declarations: [PendingBonusComponent],
  imports: [
    CommonModule,
    PaginationModule
  ],
  exports: [PendingBonusComponent]
})
export class PendingBonusModule { }
