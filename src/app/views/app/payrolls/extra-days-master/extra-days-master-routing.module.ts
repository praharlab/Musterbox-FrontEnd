import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListExtraDaysComponent } from './list-extra-days/list-extra-days.component';


const routes: Routes = [
  { path: '', component: ListExtraDaysComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExtraDaysMasterRoutingModule { }
