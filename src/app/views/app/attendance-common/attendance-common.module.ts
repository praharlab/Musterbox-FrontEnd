import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveAcceptRejectModalComponent } from './leave-accept-reject-modal/leave-accept-reject-modal.component'
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { CoffAcceptRejectModalComponent } from './coff-accept-reject-modal/coff-accept-reject-modal.component';

import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [LeaveAcceptRejectModalComponent, CoffAcceptRejectModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    NgSelectModule,
    ModalModule,
    SimpleNotificationsModule.forRoot()
  ],
  exports: [
    LeaveAcceptRejectModalComponent,
    CoffAcceptRejectModalComponent
  ]
})
export class AttendanceCommonModule { }
