import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExpiryJoiningDocumentTabComponent } from './expiry-joining-document-tab.component';


const routes: Routes = [
  { path: '', component: ExpiryJoiningDocumentTabComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpiryJoiningDocumentTabRoutingModule { }
