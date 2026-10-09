import { NgModule, Injectable } from '@angular/core';
import { CalendarComponent } from './calendar/calendar.component';
import { IconCardsCarouselComponent } from './icon-cards-carousel/icon-cards-carousel.component';
import { RecentOrdersComponent } from './recent-orders/recent-orders.component';
import { SortableStatisticsRowComponent } from './sortable-statistics-row/sortable-statistics-row.component';
import { TicketsComponent } from './tickets/tickets.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsCarouselModule } from 'src/app/components/carousel/components.carousel.module';
import { ComponentsChartModule } from 'src/app/components/charts/components.charts.module';
import { ComponentsCardsModule } from 'src/app/components/cards/components.cards.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ComponentsSortablejsModule } from 'src/app/components/sortablejs/components.sortablejs.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RatingModule } from 'ngx-bootstrap/rating';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { FullCalendarModule } from '@fullcalendar/angular'; // the main connector. must go first

import { BirthdayCardComponent } from './birthday-card/birthday-card.component';
import { DashboardCalendarComponent } from './dashboard-calendar/dashboard-calendar.component';
import { WorkAnniversaryComponent } from './work-anniversary/work-anniversary.component';
import { AttendaceCalendarComponent } from './attendace-calendar/attendace-calendar.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AnniversaryCardComponent } from './anniversary-card/anniversary-card.component';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { MessageBoxComponent } from '../dashboards/message-box/message-box.component';
import { CompanySubscriptionPlanExpirationComponent } from './company-subscription-plan-expiration/company-subscription-plan-expiration.component';
import { WebPunchInOutComponent } from './web-punch-in-out/web-punch-in-out.component';
import { LayoutContainersModule } from '../layout/layout.containers.module';

@NgModule({
  declarations: [
    CalendarComponent,
    IconCardsCarouselComponent,
    RecentOrdersComponent,
    SortableStatisticsRowComponent,
    TicketsComponent,
    BirthdayCardComponent,
    DashboardCalendarComponent,
    WorkAnniversaryComponent,
    AttendaceCalendarComponent,
    AnniversaryCardComponent,
    MessageBoxComponent,
    CompanySubscriptionPlanExpirationComponent,
    WebPunchInOutComponent,
  ],
  imports: [
    SharedModule,
    ComponentsCarouselModule,
    ComponentsChartModule,
    FullCalendarModule,
    ComponentsCardsModule,
    NgxDatatableModule,
    ComponentsSortablejsModule,
    RatingModule,
    FormsModule,
    NgSelectModule,
    ProgressbarModule,
    ModalModule,
    BsDropdownModule,
    TabsModule,
    SimpleNotificationsModule.forRoot(),
    NgxUiLoaderModule,
    LayoutContainersModule,
  ],
  providers: [],
  exports: [
    CalendarComponent,
    IconCardsCarouselComponent,
    RecentOrdersComponent,
    SortableStatisticsRowComponent,
    TicketsComponent,
    BirthdayCardComponent,
    AnniversaryCardComponent,
    DashboardCalendarComponent,
    WorkAnniversaryComponent,
    AttendaceCalendarComponent,
    MessageBoxComponent,
    CompanySubscriptionPlanExpirationComponent,
    WebPunchInOutComponent,
  ],
})
export class DashboardsContainersModule { }
