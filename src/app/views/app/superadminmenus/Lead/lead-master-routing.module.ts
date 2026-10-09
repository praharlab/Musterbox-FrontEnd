import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListLeadMasterComponent } from './list-lead-master/list-lead-master.component';


const routes: Routes = [
  { path: '', component: ListLeadMasterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadMasterRoutingModule { }
