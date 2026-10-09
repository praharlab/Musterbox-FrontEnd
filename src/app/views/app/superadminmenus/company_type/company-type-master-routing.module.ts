import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListCompanyTypeComponent } from './list-company-type/list-company-type.component';
import { AddCompanyTypeComponent } from './add-company-type/add-company-type.component';
import { EditCompanyTypeComponent } from './edit-company-type/edit-company-type.component';


const routes: Routes = [
  { path: '', component: ListCompanyTypeComponent },
  { path: 'add_company_type', component: AddCompanyTypeComponent },
  { path: 'edit_company_type', component: EditCompanyTypeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyTypeMasterRoutingModule { }
