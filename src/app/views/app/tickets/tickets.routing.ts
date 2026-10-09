import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TicketsComponent } from './tickets.component';
import { TicketChatComponent } from './ticket-chat/ticket-chat.component';
import { TicketMasterComponent } from './ticket-master/ticket-master.component';
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [
  {
    path: '',
    component: TicketsComponent,
    children: [
      { path: '', redirectTo: 'ticketMaster', pathMatch: 'full' },

      { path: 'ticketMaster', component: TicketMasterComponent },

      { path: 'ticketDashboard', loadChildren: () => import('./ticket-dashboard/ticket-dashboard-master.module').then((m) => m.TicketDashboardMasterModule) },

      { path: 'listTicketCategory', loadChildren: () => import('./ticketCategory/ticket-category-master.module').then((m) => m.TicketCategoryMasterModule) },

      { path: 'listTicketSubCategory', loadChildren: () => import('./ticketSubCategory/ticket-sub-category-master.module').then((m) => m.TicketSubCategoryMasterModule) },

      { path: 'listTicket', loadChildren: () => import('./ticket/ticket-master.module').then((m) => m.TicketMasterModule) },

      { path: 'ticketChat', component: TicketChatComponent },

      { path: 'chat', component: ChatComponent },
      { path: 'all_tickets', loadChildren: () => import('./all-tickets/all-tickets-master.module').then((m) => m.AllTicketsMasterModule) },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketsRoutingModule { }
