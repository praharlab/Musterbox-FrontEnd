import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListJoiningDocumentTypeComponent } from './list-joining-document-type/list-joining-document-type.component';
import { AddJoiningDocumentTypeComponent } from './add-joining-document-type/add-joining-document-type.component';
import { EditJoiningDocumentTypeComponent } from './edit-joining-document-type/edit-joining-document-type.component';


const routes: Routes = [
  { path: '', component: ListJoiningDocumentTypeComponent },
  { path: 'add_joiningDocument', component: AddJoiningDocumentTypeComponent },
  { path: 'edit_joiningDocumentType', component: EditJoiningDocumentTypeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JoiningDocTypeMasterRoutingModule { }
