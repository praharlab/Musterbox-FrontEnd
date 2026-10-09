import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListUserRequestBoxComponent } from './list-user-request-box.component';


const routes: Routes = [{
  path: '',
  component: ListUserRequestBoxComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListUserRequestBoxRoutingModule { }
