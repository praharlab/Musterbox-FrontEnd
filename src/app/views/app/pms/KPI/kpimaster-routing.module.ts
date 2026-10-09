import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListKpiComponent } from './list-kpi/list-kpi.component';


const routes: Routes = [
  { path: '', component: ListKpiComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KPIMasterRoutingModule { }
