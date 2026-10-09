import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListPolicyDocumentsComponent } from './list-policy-documents/list-policy-documents.component';
import { AddPolicyDocumentsComponent } from './add-policy-documents/add-policy-documents.component';
import { EditPolicyDocumentsComponent } from './edit-policy-documents/edit-policy-documents.component';


const routes: Routes = [
  { path: '', component: ListPolicyDocumentsComponent },
  { path: 'addPolicyDocuments', component: AddPolicyDocumentsComponent },
  { path: 'editPolicyDocuments', component: EditPolicyDocumentsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PolicyDocumentsMasterRoutingModule { }
