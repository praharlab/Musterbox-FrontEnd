import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetReportComponent } from './asset-report.component';


const routes: Routes = [
  { path: '', component: AssetReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetReportMasterRoutingModule { }
