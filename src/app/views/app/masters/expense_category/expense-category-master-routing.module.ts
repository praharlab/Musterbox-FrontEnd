import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListExpenseCategoryComponent } from './list-expense-category/list-expense-category.component';
import { AddExpenseCategoryComponent } from './add-expense-category/add-expense-category.component';
import { EditExpenseCategoryComponent } from './edit-expense-category/edit-expense-category.component';
import { ImportExpenseCategoryComponent } from './import-expense-category/import-expense-category.component';


const routes: Routes = [
  { path: '', component: ListExpenseCategoryComponent },
  { path: 'add_expense_category', component: AddExpenseCategoryComponent },
  { path: 'edit_expense_category', component: EditExpenseCategoryComponent },
  { path: 'import_expense_category', component: ImportExpenseCategoryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpenseCategoryMasterRoutingModule { }
