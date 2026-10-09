import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppversionComponent } from './appversion.component';


const routes: Routes = [
  { path: '', component: AppversionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppVersionMasterRoutingModule { }
