import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListCompanyMasterComponent } from './list-company-master/list-company-master.component';
import { AddCompanyMasterComponent } from './add-company-master/add-company-master.component';
import { ViewCompanyMasterComponent } from './view-company-master/view-company-master.component';
import { EditCompanyMasterComponent } from './edit-company-master/edit-company-master.component';


const routes: Routes = [
  { path: '', component: ListCompanyMasterComponent },
  { path: 'add_company_master', component: AddCompanyMasterComponent },
  { path: 'view_company_master', component: ViewCompanyMasterComponent },
  { path: 'edit_company_master', component: EditCompanyMasterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyMasterRoutingModule { }
