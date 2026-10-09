import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListResignationProcessComponent } from './list-resignation-process/list-resignation-process.component';
import { AddResignationProcessComponent } from './add-resignation-process/add-resignation-process.component';
import { EditResignationProcessComponent } from './edit-resignation-process/edit-resignation-process.component';


const routes: Routes = [
  { path: '', component: ListResignationProcessComponent },
  { path: 'add-clearance-and-exit', component: AddResignationProcessComponent },
  { path: 'edit-clearance-and-exit', component: EditResignationProcessComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResignationProcessMasterRoutingModule { }
