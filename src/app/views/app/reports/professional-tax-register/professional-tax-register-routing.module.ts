import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfessionalTaxRegisterComponent } from './professional-tax-register.component';



const routes: Routes = [
  { path: '', component: ProfessionalTaxRegisterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfessionalTaxRegisterRoutingModule { }
