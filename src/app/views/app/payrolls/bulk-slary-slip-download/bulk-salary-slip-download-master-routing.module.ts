import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BulkSlarySlipDownloadComponent } from './bulk-slary-slip-download.component';


const routes: Routes = [
  { path: '', component: BulkSlarySlipDownloadComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulkSalarySlipDownloadMasterRoutingModule { }
