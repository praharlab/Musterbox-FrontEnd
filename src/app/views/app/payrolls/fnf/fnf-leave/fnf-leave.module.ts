import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FnfLeaveRoutingModule } from './fnf-leave-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { FnfLeaveComponent } from './fnf-leave.component';

@NgModule({
  declarations: [FnfLeaveComponent],
  imports: [
    CommonModule,
    FnfLeaveRoutingModule,
    ModalModule,
    NgxUiLoaderModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    SimpleNotificationsModule.forRoot(),
  ],
  exports: [FnfLeaveComponent]
})
export class FnfLeaveModule { }
