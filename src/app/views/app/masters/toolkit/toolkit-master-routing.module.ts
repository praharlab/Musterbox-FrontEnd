import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ToolkitComponent } from './toolkit.component';


const routes: Routes = [
  { path: '', component: ToolkitComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToolkitMasterRoutingModule { }
