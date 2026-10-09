import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileStatusTabComponent } from './profile-status-tab.component';


const routes: Routes = [
  { path: '', component: ProfileStatusTabComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileStatusTabRoutingModule { }
