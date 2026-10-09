import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MissPunchReportComponent } from './miss-punch-report.component';


const routes: Routes = [{
  path: '',
  component: MissPunchReportComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MissPunchReportRoutingModule { }
