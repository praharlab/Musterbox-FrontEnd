import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListOfficeExpenseComponent } from './list-office-expense/list-office-expense.component';
import { AddOfficeExpenseComponent } from './add-office-expense/add-office-expense.component';
import { EditOfficeExpenseComponent } from './edit-office-expense/edit-office-expense.component';
import { ReapplyOfficeExpenseComponent } from './reapply-office-expense/reapply-office-expense.component';


const routes: Routes = [
  { path: '', component: ListOfficeExpenseComponent },
  { path: 'add', component: AddOfficeExpenseComponent },
  { path: 'edit', component: EditOfficeExpenseComponent },
  { path: 'reapply', component: ReapplyOfficeExpenseComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfficeExpenseRoutingModule { }
