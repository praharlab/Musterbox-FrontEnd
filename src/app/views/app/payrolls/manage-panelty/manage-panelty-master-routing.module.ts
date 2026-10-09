import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagePaneltyComponent } from './manage-panelty.component';


const routes: Routes = [
  { path: '', component: ManagePaneltyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagePaneltyMasterRoutingModule { }
