import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvanceRejectModalComponent } from './advance-reject-modal/advance-reject-modal.component'
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { LoanRejectModalComponent } from './loan-reject-modal/loan-reject-modal.component';
import { ExpenseAcceptRejectModalComponent } from './expense-accept-reject-modal/expense-accept-reject-modal.component';


@NgModule({
  declarations: [AdvanceRejectModalComponent, LoanRejectModalComponent, ExpenseAcceptRejectModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    ModalModule,
    SimpleNotificationsModule.forRoot()
  ],
  exports: [
    AdvanceRejectModalComponent,
    LoanRejectModalComponent,
    ExpenseAcceptRejectModalComponent
  ]
})
export class FinanceCommonModule { }
