import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeIdCardComponent } from './employee-id-card.component';


const routes: Routes = [
  { path: '', component: EmployeeIdCardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeIdcardMasterRoutingModule { }
