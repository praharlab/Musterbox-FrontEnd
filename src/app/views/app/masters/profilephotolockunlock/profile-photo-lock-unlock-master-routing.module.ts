import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfilephotolockunlockComponent } from './profilephotolockunlock.component';


const routes: Routes = [
  { path: '', component: ProfilephotolockunlockComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfilePhotoLockUnlockMasterRoutingModule { }
