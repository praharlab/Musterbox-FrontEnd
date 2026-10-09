import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyExtraDaysComponent } from './my-extra-days.component';


const routes: Routes = [
  { path: '', component: MyExtraDaysComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyExtraDaysRoutingModule { }
