import { NgModule } from '@angular/core';
import { DefaultComponent } from './default/default.component';
import { DashboardsComponent } from './dashboards.component';
import { DashboardsRoutingModule } from './dashboards.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardsContainersModule } from 'src/app/containers/dashboards/dashboards.containers.module';
import { ComponentsCardsModule } from 'src/app/components/cards/components.cards.module';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SubscriptionPlanAnalytictsComponent } from './default/subscription-plan-analyticts/subscription-plan-analyticts.component';
import { PunchInTodayComponent } from './punch-in-today/punch-in-today.component';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { HrDashboardModule } from '../payrolls/hr-dashboard/hr-dashboard.module';


@NgModule({
  declarations: [
    DefaultComponent,
    DashboardsComponent,
    SubscriptionPlanAnalytictsComponent,
    PunchInTodayComponent
  ],
  imports: [
    SharedModule,
    LayoutContainersModule,
    DashboardsContainersModule,
    NgxUiLoaderModule,
    DashboardsRoutingModule,
    ComponentsCardsModule,
    PagesContainersModule,
    PaginationModule,
    TabsModule,
    FormsModule,
    ModalModule,
    CommonModule,
    AngularDualListBoxModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxDatatableModule,
    TooltipModule,
    NgSelectModule,
    SimpleNotificationsModule.forRoot(),
    RoundProgressModule,
    HrDashboardModule
  ],
})
export class DashboardsModule { }
