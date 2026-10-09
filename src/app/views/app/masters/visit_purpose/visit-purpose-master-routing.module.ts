import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListVisitPurposeComponent } from './list-visit-purpose/list-visit-purpose.component';
import { AddVisitPurposeComponent } from './add-visit-purpose/add-visit-purpose.component';
import { EditVisitPurposeComponent } from './edit-visit-purpose/edit-visit-purpose.component';
import { ImportVisitPurposeComponent } from './import-visit-purpose/import-visit-purpose.component';


const routes: Routes = [
  { path: '', component: ListVisitPurposeComponent },
  { path: 'add_visit_purpose', component: AddVisitPurposeComponent },
  { path: 'edit_visit_purpose', component: EditVisitPurposeComponent },
  { path: 'import_visit_purpose', component: ImportVisitPurposeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisitPurposeMasterRoutingModule { }
