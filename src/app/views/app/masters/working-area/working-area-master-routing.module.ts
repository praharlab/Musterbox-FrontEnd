import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListWorkingAreaComponent } from './list-working-area/list-working-area.component';
import { AddWorkingAreaComponent } from './add-working-area/add-working-area.component';
import { EditWorkingAreaComponent } from './edit-working-area/edit-working-area.component';
import { ImportWorkingAreaComponent } from './import-working-area/import-working-area.component';


const routes: Routes = [
  { path: '', component: ListWorkingAreaComponent },
  { path: 'add_working_area', component: AddWorkingAreaComponent },
  { path: 'edit_working_area', component: EditWorkingAreaComponent },
  { path: 'import_workingArea', component: ImportWorkingAreaComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkingAreaMasterRoutingModule { }
