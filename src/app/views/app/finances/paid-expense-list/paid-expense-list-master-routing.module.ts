import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaidExpenseListComponent } from './paid-expense-list.component';


const routes: Routes = [
  { path: '', component: PaidExpenseListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaidExpenseListMasterRoutingModule { }
