import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErpsyncComponent } from './erpsync.component';


const routes: Routes = [
  { path: '', component: ErpsyncComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErpSyncMasterRoutingModule { }
