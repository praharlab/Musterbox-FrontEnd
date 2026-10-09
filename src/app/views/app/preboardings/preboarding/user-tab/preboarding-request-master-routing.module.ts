import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserTabComponent } from './user-tab.component';


const routes: Routes = [
  { path: '', component: UserTabComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreboardingRequestMasterRoutingModule { }
