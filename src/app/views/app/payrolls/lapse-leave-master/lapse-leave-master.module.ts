import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LapseLeaveMasterComponent } from './lapse-leave-master.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PaginationModule } from 'ngx-bootstrap/pagination';



@NgModule({
  declarations: [LapseLeaveMasterComponent],
  imports: [
    CommonModule,
    NgxUiLoaderModule,
    PaginationModule
  ],
  exports: [LapseLeaveMasterComponent]
})
export class LapseLeaveMasterModule { }
