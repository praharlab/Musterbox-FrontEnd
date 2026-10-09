import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListMinimumWagesMasterComponent } from './list-minimum-wages-master/list-minimum-wages-master.component';
import { AddMinimumWagesMasterComponent } from './add-minimum-wages-master/add-minimum-wages-master.component';
import { EditMinimumWagesMasterComponent } from './edit-minimum-wages-master/edit-minimum-wages-master.component';



const routes: Routes = [
  { path: '', component: ListMinimumWagesMasterComponent },
  { path: 'add_minimumWagesMaster', component: AddMinimumWagesMasterComponent },
  { path: 'edit_minimumWagesMaster', component: EditMinimumWagesMasterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MinimumWagesMasterRoutingModule { }
