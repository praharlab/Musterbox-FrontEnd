import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListLeaveMasterComponent } from './list-leave-master/list-leave-master.component';
import { AddLeaveMasterComponent } from './add-leave-master/add-leave-master.component';
import { EditLeaveMasterComponent } from './edit-leave-master/edit-leave-master.component';


const routes: Routes = [
  { path: '', component: ListLeaveMasterComponent },
  { path: 'addleavemaster', component: AddLeaveMasterComponent },
  { path: 'editleavemaster', component: EditLeaveMasterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveMasterRoutingModule { }
