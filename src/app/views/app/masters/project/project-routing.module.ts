import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListProjectComponent } from './list-project/list-project.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { EditProjectComponent } from './edit-project/edit-project.component';
import { ImportProjectComponent } from './import-project/import-project.component';


const routes: Routes = [
  { path: '', component: ListProjectComponent },
  { path: 'addProject', component: AddProjectComponent },
  { path: 'editProject', component: EditProjectComponent },
  { path: 'importProject', component: ImportProjectComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
