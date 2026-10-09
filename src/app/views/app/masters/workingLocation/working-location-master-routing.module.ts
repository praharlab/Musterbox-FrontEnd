import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListWorkingLocationComponent } from './list-working-location/list-working-location.component';
import { AddWorkingLocationComponent } from './add-working-location/add-working-location.component';
import { EditWorkingLocationComponent } from './edit-working-location/edit-working-location.component';
import { ImportWorkingLocationComponent } from './import-working-location/import-working-location.component';


const routes: Routes = [
  { path: '', component: ListWorkingLocationComponent },
  { path: 'add_workingLocation', component: AddWorkingLocationComponent },
  { path: 'edit_workingLocation', component: EditWorkingLocationComponent },
  { path: 'import_workingLocation', component: ImportWorkingLocationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkingLocationMasterRoutingModule { }
