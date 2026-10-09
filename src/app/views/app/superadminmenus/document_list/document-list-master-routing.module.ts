import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListDocumentListComponent } from './list-document-list/list-document-list.component';
import { AddDocumentListComponent } from './add-document-list/add-document-list.component';
import { EditDocumentListComponent } from './edit-document-list/edit-document-list.component';


const routes: Routes = [
  { path: '', component: ListDocumentListComponent },
  { path: 'add_document_list', component: AddDocumentListComponent },
  { path: 'edit_document_list', component: EditDocumentListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentListMasterRoutingModule { }
