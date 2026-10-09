import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListOfficeExpRequestComponent } from './list-office-exp-request/list-office-exp-request.component';


const routes: Routes = [
  { path: '', component: ListOfficeExpRequestComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfficeExpenseRequestRoutingModule { }
