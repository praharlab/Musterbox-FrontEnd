import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListJobPostingComponent } from './list-job-posting/list-job-posting.component';
import { AddJobPostingComponent } from './add-job-posting/add-job-posting.component';
import { EditJobPostingComponent } from './edit-job-posting/edit-job-posting.component';


const routes: Routes = [
  { path: '', component: ListJobPostingComponent },
  { path: 'add_jobPosting', component: AddJobPostingComponent },
  { path: 'edit_jobPosting', component: EditJobPostingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobPostingMasterRoutingModule { }
