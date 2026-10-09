import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExpenserequestComponent } from './expenserequest.component';
import { EditExpenserequestComponent } from './edit-expenserequest/edit-expenserequest.component';


const routes: Routes = [
  { path: '', component: ExpenserequestComponent },
  { path: 'edit_expense_request', component: EditExpenserequestComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpenseRequestMasterRoutingModule { }
