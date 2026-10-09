import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Form16sComponent } from './form16s.component';
import { Form16MasterComponent } from './form16-master/form16-master.component';
import { ListTdsSlabComponent } from './tds_slab/list-tds-slab/list-tds-slab.component';
import { AddEmployeeInvestmentComponent } from './employee-investment/add-employee-investment/add-employee-investment.component';
import { EditEmployeeInvestmentComponent } from './employee-investment/edit-employee-investment/edit-employee-investment.component';
import { ListEmployeeInvestmentComponent } from './employee-investment/list-employee-investment/list-employee-investment.component';
import { Form16reportComponent } from './form16report/form16report.component';
import { AddQuaterTaxChallanComponent } from './quater_tax_challan/add-quater-tax-challan/add-quater-tax-challan.component';
import { EditQuaterTaxChallanComponent } from './quater_tax_challan/edit-quater-tax-challan/edit-quater-tax-challan.component';
import { ListQuaterTaxChallanComponent } from './quater_tax_challan/list-quater-tax-challan/list-quater-tax-challan.component';
import { AddTaxChallanComponent } from './tax_challan/add-tax-challan/add-tax-challan.component';
import { EditTaxChallanComponent } from './tax_challan/edit-tax-challan/edit-tax-challan.component';
import { ListTaxChallanComponent } from './tax_challan/list-tax-challan/list-tax-challan.component';
import { AddTdsSlabComponent } from './tds_slab/add-tds-slab/add-tds-slab.component';
import { EditTdsSlabComponent } from './tds_slab/edit-tds-slab/edit-tds-slab.component';

const routes: Routes = [
  {
    path: '',
    component: Form16sComponent,
    children: [
      { path: '', redirectTo: 'form16_master', pathMatch: 'full' },
      { path: 'form16_master', component: Form16MasterComponent },
      { path: 'tds_slab', component: ListTdsSlabComponent },
      { path: 'add_tds_slab', component: AddTdsSlabComponent },
      { path: 'edit_tds_slab/:id', component: EditTdsSlabComponent },
      { path: 'quater_tax_challan', component: ListQuaterTaxChallanComponent },
      {
        path: 'add_quater_tax_challan',
        component: AddQuaterTaxChallanComponent,
      },
      {
        path: 'edit_quater_tax_challan/:id',
        component: EditQuaterTaxChallanComponent,
      },
      { path: 'tax_challan', component: ListTaxChallanComponent },
      { path: 'add_tax_challan', component: AddTaxChallanComponent },
      { path: 'edit_tax_challan/:id', component: EditTaxChallanComponent },
      {
        path: 'employee_investment',
        component: ListEmployeeInvestmentComponent,
      },
      {
        path: 'add_employee_investment',
        component: AddEmployeeInvestmentComponent,
      },
      {
        path: 'edit_employee_investment/:id',
        component: EditEmployeeInvestmentComponent,
      },

      { path: 'form16report', component: Form16reportComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Form16sRoutingModule {}
