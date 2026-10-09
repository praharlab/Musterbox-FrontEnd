import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListCompanyDocumentComponent } from './list-company-document/list-company-document.component';
import { AddCompanyDocumentComponent } from './add-company-document/add-company-document.component';
import { EditCompanyDocumentComponent } from './edit-company-document/edit-company-document.component';


const routes: Routes = [
  { path: '', component: ListCompanyDocumentComponent },
  { path: 'add_company_document', component: AddCompanyDocumentComponent },
  { path: 'edit_company_document', component: EditCompanyDocumentComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyDocumentMasterRoutingModule { }
