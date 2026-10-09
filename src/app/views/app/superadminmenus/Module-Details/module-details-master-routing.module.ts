import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModuleDetailsComponent } from './module-details/module-details.component';
import { AddModuleDetailsComponent } from './add-module-details/add-module-details.component';
import { EditModuleDetailsComponent } from './edit-module-details/edit-module-details.component';


const routes: Routes = [
  { path: '', component: ModuleDetailsComponent },
  { path: 'add_Module_details', component: AddModuleDetailsComponent },
  { path: 'edit_Module_details', component: EditModuleDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModuleDetailsMasterRoutingModule { }
