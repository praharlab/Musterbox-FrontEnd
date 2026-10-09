import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListAdvancePaymentComponent } from './list-advance-payment/list-advance-payment.component';
import { AddAdvancePaymentComponent } from './add-advance-payment/add-advance-payment.component';
import { EditAdvancePaymentComponent } from './edit-advance-payment/edit-advance-payment.component';
import { ImportAdvancePaymentComponent } from './import-advance-payment/import-advance-payment.component';


const routes: Routes = [
  { path: '', component: ListAdvancePaymentComponent },
  { path: 'add_advancePayment', component: AddAdvancePaymentComponent },
  { path: 'edit_advancePayment', component: EditAdvancePaymentComponent },
  { path: 'import_advancePayment', component: ImportAdvancePaymentComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdvancePaymentMasterRoutingModule { }
