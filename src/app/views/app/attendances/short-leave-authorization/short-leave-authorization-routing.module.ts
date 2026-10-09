import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListShortLeaveAuthorizationComponent } from './list-short-leave-authorization/list-short-leave-authorization.component';


const routes: Routes = [
  {path: '', component: ListShortLeaveAuthorizationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShortLeaveAuthorizationRoutingModule { }
