import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllTicketsComponent } from './all-tickets.component';


const routes: Routes = [
  { path: '', component: AllTicketsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllTicketsMasterRoutingModule { }
