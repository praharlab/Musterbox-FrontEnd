import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewFNFCountComponent } from '../view-fnf-count/view-fnf-count.component';



@NgModule({
  declarations: [ViewFNFCountComponent],
  imports: [
    CommonModule,
  ],
  exports: [ViewFNFCountComponent]
})
export class ViewFNFCountModule { }
