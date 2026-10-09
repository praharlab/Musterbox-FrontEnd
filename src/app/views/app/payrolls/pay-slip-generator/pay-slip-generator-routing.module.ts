import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaySlipGeneratorComponent } from './pay-slip-generator.component';
import { ImportPaySlipGeneratorComponent } from './import-pay-slip-generator/import-pay-slip-generator.component';


const routes: Routes = [
  { path: '', component: PaySlipGeneratorComponent },
  { path: 'import_paySlip_Generator', component: ImportPaySlipGeneratorComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaySlipGeneratorRoutingModule { }
