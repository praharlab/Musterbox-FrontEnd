import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserDocumentExpiryComponent } from './user-document-expiry.component';


const routes: Routes = [
  { path: '', component: UserDocumentExpiryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserDocumentExpiryMasterRoutingModule { }
