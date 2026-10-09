import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HrTabComponent } from './hr-tab.component';


const routes: Routes = [
  { path: '', component: HrTabComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrPreboardingMasterRoutingModule { }
