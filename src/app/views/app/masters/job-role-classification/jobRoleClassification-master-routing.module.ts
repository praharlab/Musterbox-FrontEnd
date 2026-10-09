import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListJobRoleClassificationComponent } from './list-job-role-classification/list-job-role-classification.component';
import { AddJobRoleClassificationComponent } from './add-job-role-classification/add-job-role-classification.component';
import { EditJobRoleClassificationComponent } from './edit-job-role-classification/edit-job-role-classification.component';

const routes: Routes = [
  { path: '', component: ListJobRoleClassificationComponent },
  { path: 'add_jobRoleClassification', component: AddJobRoleClassificationComponent },
  { path: 'edit_jobRoleClassification', component: EditJobRoleClassificationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobRoleClassificationMasterRoutingModule { }
