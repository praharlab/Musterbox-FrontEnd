import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmpBonusPaymentComponent } from './emp-bonus-payment.component';
import { ViewEmpBonusDetailsComponent } from './view-emp-bonus-details/view-emp-bonus-details.component';


const routes: Routes = [
  { path: '', component: EmpBonusPaymentComponent },
  { path: 'view', component: ViewEmpBonusDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpBonusPaymentRoutingModule { }
