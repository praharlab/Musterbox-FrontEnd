import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListIncentivetypeComponent } from './list-incentivetype/list-incentivetype.component';
import { AddIncentivetypeComponent } from './add-incentivetype/add-incentivetype.component';
import { EditIncentivetypeComponent } from './edit-incentivetype/edit-incentivetype.component';


const routes: Routes = [
  { path: '', component: ListIncentivetypeComponent },
  { path: 'add-incentivetype', component: AddIncentivetypeComponent },
  { path: 'edit-incentivetype', component: EditIncentivetypeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncentiveTypeMasterRoutingModule { }
