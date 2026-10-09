import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChecklistAdminComponent } from './checklist-admin.component';


const routes: Routes = [
  { path: '', component: ChecklistAdminComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminChecklistMasterRoutingModule { }
