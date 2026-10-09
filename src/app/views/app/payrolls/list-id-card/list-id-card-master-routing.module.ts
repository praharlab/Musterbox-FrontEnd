import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListIdCardComponent } from './list-id-card.component';


const routes: Routes = [
  { path: '', component: ListIdCardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListIdCardMasterRoutingModule { }
