import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListJobApplicationComponent } from './list-job-application/list-job-application.component';


const routes: Routes = [
  { path: '', component: ListJobApplicationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobApplicationMasterRoutingModule { }
