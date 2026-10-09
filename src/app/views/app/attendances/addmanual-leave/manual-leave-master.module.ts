import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManualLeaveMasterRoutingModule } from './manual-leave-master-routing.module';
import { AddmanualLeaveComponent } from './addmanual-leave.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [AddmanualLeaveComponent],
  imports: [
    CommonModule,
    ManualLeaveMasterRoutingModule,
    NgxUiLoaderModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    SimpleNotificationsModule.forRoot()
  ],
  exports: [AddmanualLeaveComponent]
})
export class ManualLeaveMasterModule { }
