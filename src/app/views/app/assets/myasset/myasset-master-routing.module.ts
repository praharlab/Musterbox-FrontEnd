import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyassetComponent } from './myasset.component';


const routes: Routes = [
  { path: '', component: MyassetComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyassetMasterRoutingModule { }
