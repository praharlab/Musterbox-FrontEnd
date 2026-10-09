import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IncomeTaxDeclarationRequestComponent } from './income-tax-declaration-request.component';


const routes: Routes = [
  { path: '', component: IncomeTaxDeclarationRequestComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncomeTaxDeclarationRequestMasterRoutingModule { }
