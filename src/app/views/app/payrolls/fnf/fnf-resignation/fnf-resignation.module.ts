import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FnfResignationComponent } from './fnf-resignation.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';



@NgModule({
  declarations: [FnfResignationComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgxUiLoaderModule,
    ModalModule,
  ],
  exports: [FnfResignationComponent]
})
export class FnfResignationModule { }
