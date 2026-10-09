import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListOfficeExpenseCategoryComponent } from './list-office-expense-category/list-office-expense-category.component';
import { AddOfficeExpenseCategoryComponent } from './add-office-expense-category/add-office-expense-category.component';
import { EditOfficeExpenseCategoryComponent } from './edit-office-expense-category/edit-office-expense-category.component';
import { ImportOfficeExpenseCategoryComponent } from './import-office-expense-category/import-office-expense-category.component';


const routes: Routes = [
  { path: '', component: ListOfficeExpenseCategoryComponent },
  { path: 'add', component: AddOfficeExpenseCategoryComponent },
  { path: 'edit', component: EditOfficeExpenseCategoryComponent },
  { path: 'import', component: ImportOfficeExpenseCategoryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfficeExpenseCategoryMasterRoutingModule { }
