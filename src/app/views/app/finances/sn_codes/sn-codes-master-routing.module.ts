import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListSncodesComponent } from './list-sncodes/list-sncodes.component';
import { AddSncodesComponent } from './add-sncodes/add-sncodes.component';
import { EditSncodesComponent } from './edit-sncodes/edit-sncodes.component';


const routes: Routes = [
  { path: '', component: ListSncodesComponent },
  { path: 'add_sn_codes', component: AddSncodesComponent },
  { path: 'edit_sn_codes', component: EditSncodesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SnCodesMasterRoutingModule { }
