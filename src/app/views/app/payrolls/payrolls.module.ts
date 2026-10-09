import { NgModule } from '@angular/core';
import { PayrollsRoutingModule } from './payrolls.routing';

import { PayrollsComponent } from './payrolls.component';
import { PayrollMasterComponent } from './payroll-master/payroll-master.component';

import { EmployeeListComponent } from './employee-list/employee-list.component';

import { CommonModule, DatePipe } from '@angular/common';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { NgxPrintModule } from 'ngx-print';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { QuillModule } from 'ngx-quill';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { PagesContainersModule } from '../../../containers/pages/pages.containers.module';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxSignaturePadModule } from 'src/app/components/signature-pad/ngx-signature-pad.module';
import { QRCodeComponent } from 'angularx-qrcode';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { ComponentsChartModule } from 'src/app/components/charts/components.charts.module';
import { AgmCoreModule } from 'src/app/components/agm/agm.module';
import { BnNgTreeModule } from 'src/app/components/bn-ng-tree/bn-ng-tree.module';
import { AgmDirectionModule } from 'src/app/components/agm/agm.module';
import { LandscapeIdCardsComponent } from './list-id-card/landscape-id-cards/landscape-id-cards.component';
import { ListEmployeeStatusComponent } from './list-employee-status/list-employee-status.component';
import { ListEmployeePunchInPunchOutComponent } from './list-employee-punch-in-punch-out/list-employee-punch-in-punch-out.component';
// import { CompensatoryOffAuthorizationRequestComponent } from './compensatory-off-authorization-request/compensatory-off-authorization-request.component';
// import { MyCompensatoryOffComponent } from './my-compensatory-off/my-compensatory-off.component';
// import { CoffAcceptRejectModalComponent } from './compensatory-off-authorization-request/coff-accept-reject-modal/coff-accept-reject-modal.component';

@NgModule({
  declarations: [
    PayrollsComponent,
    PayrollMasterComponent,
    EmployeeListComponent,
    LandscapeIdCardsComponent,
    ListEmployeeStatusComponent,
    ListEmployeePunchInPunchOutComponent,
    // CompensatoryOffAuthorizationRequestComponent,
    // MyCompensatoryOffComponent,
    // CoffAcceptRejectModalComponent,
  ],
  providers: [DatePipe],
  imports: [
    CommonModule,
    AngularDualListBoxModule,
    NgMultiSelectDropDownModule.forRoot(),
    PayrollsRoutingModule,
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

    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAQyXIWhOoRo6rj0PcaYdEbVTSiu2EHiq4',
    }),
    ComponentsChartModule,
  ]
})
export class PayrollsModule { }
