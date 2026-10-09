import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResignationTaskComponent } from './resignation-task.component';


const routes: Routes = [
  { path: '', component: ResignationTaskComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResignationTaskMasterRoutingModule { }
