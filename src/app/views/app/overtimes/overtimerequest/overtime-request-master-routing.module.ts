import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OvertimerequestComponent } from './overtimerequest.component';


const routes: Routes = [
  { path: '', component: OvertimerequestComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OvertimeRequestMasterRoutingModule { }
