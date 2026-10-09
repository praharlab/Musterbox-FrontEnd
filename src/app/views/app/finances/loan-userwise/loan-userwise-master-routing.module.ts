import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoanUserwiseComponent } from './loan-userwise.component';
import { AddLoanUserwiseComponent } from './add-loan-userwise/add-loan-userwise.component';


const routes: Routes = [
  { path: '', component: LoanUserwiseComponent },
  { path: 'add_loanUserwise', component: AddLoanUserwiseComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanUserwiseMasterRoutingModule { }
