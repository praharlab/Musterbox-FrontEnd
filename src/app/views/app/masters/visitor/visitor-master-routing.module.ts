import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListVisitorComponent } from './list-visitor/list-visitor.component';
import { AddVisitorComponent } from './add-visitor/add-visitor.component';
import { EditVisitorComponent } from './edit-visitor/edit-visitor.component';
import { ImportVisitorComponent } from './import-visitor/import-visitor.component';


const routes: Routes = [
  { path: '', component: ListVisitorComponent },
  { path: 'add_visitor', component: AddVisitorComponent },
  { path: 'edit_visitor', component: EditVisitorComponent },
  { path: 'import_visitor', component: ImportVisitorComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisitorMasterRoutingModule { }
