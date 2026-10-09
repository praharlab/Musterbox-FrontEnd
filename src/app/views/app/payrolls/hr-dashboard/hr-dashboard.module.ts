import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TranslateModule } from '@ngx-translate/core';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { HrDashboardRoutingModule } from './hr-dashboard-routing.module';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { HrDashboardComponent } from './hr-dashboard.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PunchInOutGraphComponent } from './punch-in-out-graph/punch-in-out-graph.component';
import { EmployeeStatusGraphComponent } from './employee-status-graph/employee-status-graph.component';
import { PayrollGraphComponent } from './payroll-graph/payroll-graph.component';
import { MissPunchComponent } from './miss-punch/miss-punch.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PerfectScrollbarModule } from 'src/app/components/perfect-scrollbar/perfect-scrollbar.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { RequestBoxComponent } from './request-box/request-box.component';
import { MonthAttendanceGraphComponent } from './month-attendance-graph/month-attendance-graph.component';
import { PunchInOutComponent } from './punch-in-out/punch-in-out.component';
import { EmployeeStatusComponent } from './employee-status/employee-status.component';
import { EmployeePunchInListModule } from '../employee-punch-in-list/employee-punch-in-list.module';


@NgModule({
  declarations: [
    HrDashboardComponent,
    PunchInOutGraphComponent,
    EmployeeStatusGraphComponent,
    PayrollGraphComponent,
    MissPunchComponent,
    RequestBoxComponent,
    MonthAttendanceGraphComponent,
    PunchInOutComponent,
    EmployeeStatusComponent
  ],
  imports: [
    CommonModule,
    HrDashboardRoutingModule,
    LayoutContainersModule,
    NgxUiLoaderModule,
    NgSelectModule,
    FormsModule,
    NgxDatatableModule,
    TranslateModule,
    RoundProgressModule,
    PaginationModule,
    TabsModule,
    ModalModule,
    PerfectScrollbarModule,
    SimpleNotificationsModule.forRoot(),
    EmployeePunchInListModule
  ],
  exports: [
    HrDashboardComponent
  ]
})
export class HrDashboardModule { }
