import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListOperationComponent } from './list-operation/list-operation.component';
import { AddOperationComponent } from './add-operation/add-operation.component';
import { EditOperationComponent } from './edit-operation/edit-operation.component';


const routes: Routes = [
  { path: '', component: ListOperationComponent },
  { path: 'add_operation', component: AddOperationComponent },
  { path: 'edit_operation', component: EditOperationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationMasterRoutingModule { }
