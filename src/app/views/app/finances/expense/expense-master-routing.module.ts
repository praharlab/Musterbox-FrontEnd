import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListExpenseComponent } from './list-expense/list-expense.component';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { EditExpenseComponent } from './edit-expense/edit-expense.component';


const routes: Routes = [
  { path: '', component: ListExpenseComponent },
  { path: 'add_expense', component: AddExpenseComponent },
  { path: 'edit_expense', component: EditExpenseComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpenseMasterRoutingModule { }
