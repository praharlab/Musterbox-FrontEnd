import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ToBeConfirmedEmployeeTabComponent } from './to-be-confirmed-employee-tab.component';


const routes: Routes = [
  { path: '', component: ToBeConfirmedEmployeeTabComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToBeConfirmedEmployeeTabRoutingModule { }
