import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListBankMasterComponent } from './list-bank-master/list-bank-master.component';
import { AddBankMasterComponent } from './add-bank-master/add-bank-master.component';
import { EditBankMasterComponent } from './edit-bank-master/edit-bank-master.component';


const routes: Routes = [
  { path: '', component: ListBankMasterComponent },
  { path: 'add_bank', component: AddBankMasterComponent },
  { path: 'edit_bank', component: EditBankMasterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankMasterRoutingModule { }
