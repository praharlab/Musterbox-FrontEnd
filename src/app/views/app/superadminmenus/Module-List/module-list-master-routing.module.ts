import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModuleListComponent } from './module-list/module-list.component';
import { AddModuleListComponent } from './add-module-list/add-module-list.component';
import { EditModuleListComponent } from './edit-module-list/edit-module-list.component';


const routes: Routes = [
  { path: '', component: ModuleListComponent },
  { path: 'add_Module_list', component: AddModuleListComponent },
  { path: 'edit_Module_list', component: EditModuleListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModuleListMasterRoutingModule { }
