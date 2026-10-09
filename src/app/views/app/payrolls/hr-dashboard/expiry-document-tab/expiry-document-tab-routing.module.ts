import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExpiryDocumentTabComponent } from './expiry-document-tab.component';


const routes: Routes = [
  { path: '', component: ExpiryDocumentTabComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpiryDocumentTabRoutingModule { }
