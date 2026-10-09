import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomizeProfileComponent } from './customize-profile.component';


const routes: Routes = [
  { path: '', component: CustomizeProfileComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomizeProfileRoutingModule { }
