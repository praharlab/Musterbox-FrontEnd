import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListTicketComponent } from './list-ticket/list-ticket.component';
import { AddTicketComponent } from './add-ticket/add-ticket.component';
import { EditTicketComponent } from './edit-ticket/edit-ticket.component';


const routes: Routes = [
  { path: '', component: ListTicketComponent },
  { path: 'addTicket', component: AddTicketComponent },
  { path: 'editTicket', component: EditTicketComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketMasterRoutingModule { }
