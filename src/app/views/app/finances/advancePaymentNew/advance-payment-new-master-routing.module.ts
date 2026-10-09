import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListAdvancePaymentNewComponent } from './list-advance-payment-new/list-advance-payment-new.component';
import { AddReqAdvPayComponent } from './add-req-adv-pay/add-req-adv-pay.component';


const routes: Routes = [
  { path: '', component: ListAdvancePaymentNewComponent },
  { path: 'reqadvancePayment', component: AddReqAdvPayComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdvancePaymentNewMasterRoutingModule { }
