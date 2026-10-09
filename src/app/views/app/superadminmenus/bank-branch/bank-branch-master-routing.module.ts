import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListBankBranchComponent } from './list-bank-branch/list-bank-branch.component';
import { AddBankBranchComponent } from './add-bank-branch/add-bank-branch.component';
import { EditBankBranchComponent } from './edit-bank-branch/edit-bank-branch.component';


const routes: Routes = [
  { path: '', component: ListBankBranchComponent },
  { path: 'add_bankBranch', component: AddBankBranchComponent },
  { path: 'edit_bankBranch', component: EditBankBranchComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankBranchMasterRoutingModule { }
