import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyCompensatoryOffComponent } from './my-compensatory-off.component';


const routes: Routes = [
  { path: '', component: MyCompensatoryOffComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompensatoryOffMasterRoutingModule { }
