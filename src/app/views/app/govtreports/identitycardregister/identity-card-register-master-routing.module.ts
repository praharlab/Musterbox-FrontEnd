import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IdentitycardregisterComponent } from './identitycardregister.component';


const routes: Routes = [
  { path: '', component: IdentitycardregisterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IdentityCardRegisterMasterRoutingModule { }
