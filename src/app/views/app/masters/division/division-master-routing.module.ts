import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListDivisionComponent } from './list-division/list-division.component';
import { AddDivisionComponent } from './add-division/add-division.component';
import { EditDivisionComponent } from './edit-division/edit-division.component';
import { ImportDivisionComponent } from './import-division/import-division.component';


const routes: Routes = [
  { path: '', component: ListDivisionComponent },
  { path: 'add_division', component: AddDivisionComponent },
  { path: 'edit_division', component: EditDivisionComponent },
  { path: 'import_division', component: ImportDivisionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DivisionMasterRoutingModule { }
