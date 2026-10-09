import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListExpenseHeadComponent } from './list-expense-head/list-expense-head.component';
import { AddExpenseHeadComponent } from './add-expense-head/add-expense-head.component';
import { EditExpenseHeadComponent } from './edit-expense-head/edit-expense-head.component';
import { ListPriceRuleComponent } from './list-price-rule/list-price-rule.component';
import { ImportExpenseHeadComponent } from './import-expense-head/import-expense-head.component';


const routes: Routes = [
  { path: '', component: ListExpenseHeadComponent },
  { path: 'add_expense_head', component: AddExpenseHeadComponent },
  { path: 'edit_expense_head', component: EditExpenseHeadComponent },
  { path: 'expense_price', component: ListPriceRuleComponent },
  { path: 'import_expense_head', component: ImportExpenseHeadComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpenseHeadMasterRoutingModule { }
