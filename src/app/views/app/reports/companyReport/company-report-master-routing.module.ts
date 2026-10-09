import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListCompanyReportComponent } from './list-company-report/list-company-report.component';
import { AddCompanyReportComponent } from './add-company-report/add-company-report.component';
import { EditCompanyReportComponent } from './edit-company-report/edit-company-report.component';


const routes: Routes = [
  { path: '', component: ListCompanyReportComponent },
  { path: 'add_company_report', component: AddCompanyReportComponent },
  { path: 'edit_company_report', component: EditCompanyReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyReportMasterRoutingModule { }
