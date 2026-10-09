import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListChecklistComponent } from './list-checklist/list-checklist.component';
import { AddChecklistComponent } from './add-checklist/add-checklist.component';


const routes: Routes = [
  { path: '', component: ListChecklistComponent },
  { path: 'add_checklist', component: AddChecklistComponent },
  // { path: 'edit_checklist', component: EditChecklistComponent }, // not use right now
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckListMasterRoutingModule { }
