import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompensatoryOffAuthorizationRequestComponent } from './compensatory-off-authorization-request.component';


const routes: Routes = [
  { path: '', component: CompensatoryOffAuthorizationRequestComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoffAuthorizationRequestMasterRoutingModule { }
