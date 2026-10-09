import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EmployeeIncomeTaxDeclarationComponent} from './employee-income-tax-declaration.component'
import { DeclarationComponent } from './declaration/declaration.component';


const routes: Routes = [
  {
    path: '',
    component: DeclarationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeIncomeTaxDeclarationRoutingModule { }
