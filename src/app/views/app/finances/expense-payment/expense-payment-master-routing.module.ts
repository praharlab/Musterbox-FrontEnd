import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExpensePaymentComponent } from './expense-payment.component';
import { ImportExpensePaymentComponent } from './import-expense-payment/import-expense-payment.component';


const routes: Routes = [
  { path: '', component: ExpensePaymentComponent },
  { path: 'import_expense_payment', component: ImportExpensePaymentComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpensePaymentMasterRoutingModule { }
