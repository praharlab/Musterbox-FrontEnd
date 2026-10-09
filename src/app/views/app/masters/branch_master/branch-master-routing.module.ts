import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListBranchMasterComponent } from './list-branch-master/list-branch-master.component';
import { AddBranchMasterComponent } from './add-branch-master/add-branch-master.component';
import { EditBranchMasterComponent } from './edit-branch-master/edit-branch-master.component';
import { ImportBranchMasterComponent } from './import-branch-master/import-branch-master.component';


const routes: Routes = [
  { path: '', component: ListBranchMasterComponent },
  { path: 'add_branch', component: AddBranchMasterComponent },
  { path: 'edit_branch', component: EditBranchMasterComponent },
  { path: 'import_branch', component: ImportBranchMasterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchMasterRoutingModule { }
