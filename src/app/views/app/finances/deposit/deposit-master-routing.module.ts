import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListDepositComponent } from './list-deposit/list-deposit.component';
import { AddDepositComponent } from './add-deposit/add-deposit.component';
import { EditDepositComponent } from './edit-deposit/edit-deposit.component';


const routes: Routes = [
  { path: '', component: ListDepositComponent },
  { path: 'add_deposit', component: AddDepositComponent },
  { path: 'edit_deposit', component: EditDepositComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepositMasterRoutingModule { }
