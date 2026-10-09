import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListOfficeExpenseHeadComponent } from './list-office-expense-head/list-office-expense-head.component';
import { AddOfficeExpenseHeadComponent } from './add-office-expense-head/add-office-expense-head.component';
import { EditOfficeExpenseHeadComponent } from './edit-office-expense-head/edit-office-expense-head.component';
import { ImportOfficeExpenseHeadComponent } from './import-office-expense-head/import-office-expense-head.component';


const routes: Routes = [
  { path: '', component: ListOfficeExpenseHeadComponent },
  { path: 'add', component: AddOfficeExpenseHeadComponent },
  { path: 'edit', component: EditOfficeExpenseHeadComponent },
  { path: 'import', component: ImportOfficeExpenseHeadComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfficeExpenseHeadMasterRoutingModule { }
