import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListKraComponent } from './list-kra/list-kra.component';


const routes: Routes = [
  { path: '', component: ListKraComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KRAMasterRoutingModule { }
