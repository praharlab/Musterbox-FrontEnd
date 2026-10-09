import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AsignassettoempComponent } from './asignassettoemp.component';
import { AddAssignAssetComponent } from './add-assign-asset/add-assign-asset.component';
import { EditAssignAssetComponent } from './edit-assign-asset/edit-assign-asset.component';


const routes: Routes = [
  { path: '', component: AsignassettoempComponent },
  { path: 'add_assign_asset', component: AddAssignAssetComponent },
  { path: 'edit_assign_asset', component: EditAssignAssetComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignAssetToEmpMasterRoutingModule { }
