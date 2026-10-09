import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketDashboardMasterRoutingModule } from './ticket-dashboard-master-routing.module';
import { TicketDashboardComponent } from './ticket-dashboard.component';
import { TicketDashboardPriorityComponent } from './ticket-dashboard-priority/ticket-dashboard-priority.component';
import { TicketDashboardStatusComponent } from './ticket-dashboard-status/ticket-dashboard-status.component';
import { TicketDashboardTicketCategoryComponent } from './ticket-dashboard-ticket-category/ticket-dashboard-ticket-category.component';
import { TicketDashboardTicketByAgentComponent } from './ticket-dashboard-ticket-by-agent/ticket-dashboard-ticket-by-agent.component';
import { TicketDashboardTicketSubcategoryComponent } from './ticket-dashboard-ticket-subcategory/ticket-dashboard-ticket-subcategory.component';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PerfectScrollbarModule } from 'src/app/components/perfect-scrollbar/perfect-scrollbar.module';


@NgModule({
  declarations: [
    TicketDashboardComponent,
    TicketDashboardPriorityComponent,
    TicketDashboardStatusComponent,
    TicketDashboardTicketCategoryComponent,
    TicketDashboardTicketByAgentComponent,
    TicketDashboardTicketSubcategoryComponent
  ],
  imports: [
    CommonModule,
    TicketDashboardMasterRoutingModule,
    LayoutContainersModule,
    NgxDatatableModule,
    PerfectScrollbarModule
  ]
})
export class TicketDashboardMasterModule { }
