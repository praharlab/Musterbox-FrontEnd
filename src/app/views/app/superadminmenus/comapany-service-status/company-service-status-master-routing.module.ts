import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListCompanyServiceStatusComponent } from './list-company-service-status/list-company-service-status.component';
import { AddCompanyServiceStatusComponent } from './add-company-service-status/add-company-service-status.component';
import { EditCompanyServiceStatusComponent } from './edit-company-service-status/edit-company-service-status.component';


const routes: Routes = [
  { path: '', component: ListCompanyServiceStatusComponent },
  { path: 'add_company_service_status', component: AddCompanyServiceStatusComponent },
  { path: 'edit_company_service_status', component: EditCompanyServiceStatusComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyServiceStatusMasterRoutingModule { }
