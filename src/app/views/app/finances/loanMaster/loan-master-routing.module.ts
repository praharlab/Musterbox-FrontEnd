import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListLoanMasterComponent } from './list-loan-master/list-loan-master.component';
import { EditLoanMasterComponent } from './edit-loan-master/edit-loan-master.component';
import { AddLoanMasterComponent } from './add-loan-master/add-loan-master.component';


const routes: Routes = [
  { path: '', component: ListLoanMasterComponent },
  { path: 'edit_loanMaster', component: EditLoanMasterComponent },
  { path: 'add_loanMaster', component: AddLoanMasterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanMasterRoutingModule { }
