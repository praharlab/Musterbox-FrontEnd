import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListAdvanceExpensePaymentComponent } from './list-advance-expense-payment/list-advance-expense-payment.component';
import { AddAdvanceExpensePaymentComponent } from './add-advance-expense-payment/add-advance-expense-payment.component';
import { EditAdvanceExpensePaymentComponent } from './edit-advance-expense-payment/edit-advance-expense-payment.component';


const routes: Routes = [
  { path: '', component: ListAdvanceExpensePaymentComponent },
  { path: 'add_advance_payment', component: AddAdvanceExpensePaymentComponent },
  { path: 'edit_advance_payment', component: EditAdvanceExpensePaymentComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdvanceExpensePaymentMasterRoutingModule { }
