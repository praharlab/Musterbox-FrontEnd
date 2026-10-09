import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListDesignationComponent } from './list-designation/list-designation.component';
import { AddDesignationComponent } from './add-designation/add-designation.component';
import { EditDesignationComponent } from './edit-designation/edit-designation.component';
import { ImportDesignationComponent } from './import-designation/import-designation.component';


const routes: Routes = [
  { path: '', component: ListDesignationComponent },
  { path: 'add_designation', component: AddDesignationComponent },
  { path: 'edit_designation', component: EditDesignationComponent },
  { path: 'import_designation', component: ImportDesignationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DesignationMasterRoutingModule { }
