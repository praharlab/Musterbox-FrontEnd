import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdultworkersregisterComponent } from './adultworkersregister.component';


const routes: Routes = [
  { path: '', component: AdultworkersregisterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdultWorkersRegisterMasterRoutingModule { }
