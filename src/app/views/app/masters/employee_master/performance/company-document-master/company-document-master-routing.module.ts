import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyDocumentComponent } from './company-document/company-document.component';


const routes: Routes = [
  { path: '', component: CompanyDocumentComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyDocumentMasterRoutingModule { }
