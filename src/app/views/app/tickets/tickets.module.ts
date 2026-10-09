import { NgModule } from '@angular/core';
import { TicketsRoutingModule } from './tickets.routing';

import { TicketsComponent } from './tickets.component';
import { TicketChatComponent } from './ticket-chat/ticket-chat.component';
import { TicketMasterComponent } from './ticket-master/ticket-master.component';
import { ChatComponent } from './chat/chat.component';

import { CommonModule, DatePipe } from '@angular/common';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PagesContainersModule } from '../../../containers/pages/pages.containers.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsChartModule } from 'src/app/components/charts/components.charts.module';


@NgModule({
  declarations: [
    TicketsComponent,
    TicketChatComponent,
    TicketMasterComponent,
    ChatComponent,
  ],
  providers: [DatePipe],
  imports: [
    CommonModule,
    AngularDualListBoxModule,
    TicketsRoutingModule,
    ModalModule,
    FormsModule,
    SharedModule,
    LayoutContainersModule,
    PagesContainersModule,
    CollapseModule,
    SimpleNotificationsModule.forRoot(),
    NgxUiLoaderModule,
    ComponentsChartModule,
    TabsModule
  ],
})
export class TicketsModule { }
