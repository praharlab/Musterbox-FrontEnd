import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListAllocateOfcExpenseRightsComponent } from './list-allocate-ofc-expense-rights/list-allocate-ofc-expense-rights.component';
import { AddAllocateOfcExpenseRightsComponent } from './add-allocate-ofc-expense-rights/add-allocate-ofc-expense-rights.component';
import { EditAllocateOfcExpenseRightsComponent } from './edit-allocate-ofc-expense-rights/edit-allocate-ofc-expense-rights.component';


const routes: Routes = [
  { path: '', component: ListAllocateOfcExpenseRightsComponent },
  { path: 'add', component: AddAllocateOfcExpenseRightsComponent },
  { path: 'edit', component: EditAllocateOfcExpenseRightsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllocateOfcExpenseRightsRoutingModule { }
