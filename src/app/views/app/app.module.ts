import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SimpleNotificationsModule } from 'angular2-notifications';

import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { ReplacePipe } from './replace-pipe';
import { SafePipe } from './safe.pipe';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { QuillModule } from 'ngx-quill';

import { DatePipe } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';

import { NgxSignaturePadModule } from 'src/app/components/signature-pad/ngx-signature-pad.module';
import { QRCodeComponent } from 'angularx-qrcode';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { ListEmployeeOvertimeComponent } from './masters/employee_master/list-employee-overtime/list-employee-overtime.component';
import { BnNgTreeModule } from 'src/app/components/bn-ng-tree/bn-ng-tree.module';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { AgmDirectionModule } from 'src/app/components/agm/agm.module';
import { AgmCoreModule } from 'src/app/components/agm/agm.module';
import { NgxPrintModule } from 'ngx-print';

import { PerformanceComponent } from './masters/employee_master/performance/performance.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ListEmployeeEmployeementComponent } from './masters/employee_master/list-employee-employeement/list-employee-employeement.component';

import { NotificationComponent } from './notification/notification.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ChatNotificationComponent } from 'src/app/chat-notification/chat-notification.component';

@NgModule({
  declarations: [
    AppComponent,
    ReplacePipe,
    SafePipe,
    ListEmployeeOvertimeComponent,
    // PerformanceComponent,
    ChangePasswordComponent,
    ListEmployeeEmployeementComponent,
    NotificationComponent,
    ChatNotificationComponent,
  ],
  imports: [
    CommonModule,
    AngularDualListBoxModule,
    NgMultiSelectDropDownModule.forRoot(),
    AppRoutingModule,
    ModalModule,
    FormsModule,
    SharedModule,
    LayoutContainersModule,
    NgxDatatableModule,
    PagesContainersModule,
    CollapseModule,
    PaginationModule,
    TabsModule,
    TooltipModule,
    NgSelectModule,
    SimpleNotificationsModule.forRoot(),
    QuillModule.forRoot(),
    NgxUiLoaderModule,
    NgxPrintModule,
    BsDatepickerModule,
    TimepickerModule,
    NgxMaterialTimepickerModule,
    ComponentsStateButtonModule,
    NgxSignaturePadModule,
    QRCodeComponent,
    PdfViewerModule,
    BnNgTreeModule,
    NgCircleProgressModule.forRoot(),
    AgmDirectionModule,
    NgxPrintModule,
    FullCalendarModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAQyXIWhOoRo6rj0PcaYdEbVTSiu2EHiq4',
    }),
  ],
  providers: [DatePipe],
})
export class AppModule { }
