import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListpayheadmasterComponent } from './listpayheadmaster/listpayheadmaster.component';
import { AddpayheadmasterComponent } from './addpayheadmaster/addpayheadmaster.component';
import { EditpayheadmasterComponent } from './editpayheadmaster/editpayheadmaster.component';


const routes: Routes = [
  { path: '', component: ListpayheadmasterComponent },
  { path: 'addpayheadmaster', component: AddpayheadmasterComponent },
  { path: 'editpayheadmaster', component: EditpayheadmasterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayheadMasterRoutingModule { }
