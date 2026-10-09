import { NgModule } from '@angular/core';

import { AttendancesRoutingModule } from './attendances.routing';

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
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { ComponentsChartModule } from 'src/app/components/charts/components.charts.module';
import { AgmCoreModule } from 'src/app/components/agm/agm.module';
import { BnNgTreeModule } from 'src/app/components/bn-ng-tree/bn-ng-tree.module';
import { AgmDirectionModule } from 'src/app/components/agm/agm.module';

import { AttendancemasterComponent } from './attendancemaster/attendancemaster.component';
import { AttendancesComponent } from './attendances.component';
import { SingleEmployeeAttendanceListComponent } from './single-employee-attendance-list/single-employee-attendance-list.component';
import { DashboardsContainersModule } from 'src/app/containers/dashboards/dashboards.containers.module';
import { CompanyLeaveDataComponent } from './company-leave-data/company-leave-data.component';
import { ListBiometricUserComponent } from './biometric-User/list-biometric-user/list-biometric-user.component';
import { AddBiometricUserComponent } from './biometric-User/add-biometric-user/add-biometric-user.component';
import { EditBiometricUserComponent } from './biometric-User/edit-biometric-user/edit-biometric-user.component';
import { ImportManualLeaveComponent } from './import-manual-leave/import-manual-leave.component';
import { AttendanceCommonModule } from '../attendance-common/attendance-common.module';

@NgModule({
  declarations: [
    AttendancesComponent,
    AttendancemasterComponent,
    SingleEmployeeAttendanceListComponent,
    CompanyLeaveDataComponent,
    ListBiometricUserComponent,
    AddBiometricUserComponent,
    EditBiometricUserComponent,
    ImportManualLeaveComponent,
  ],
  providers: [DatePipe],
  imports: [
    CommonModule,
    AngularDualListBoxModule,
    NgMultiSelectDropDownModule.forRoot(),
    AttendancesRoutingModule,
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
    NgxPrintModule,
    ComponentsChartModule,
    DashboardsContainersModule,
    AttendanceCommonModule
  ],
  exports: [],
})
export class AttendancesModule { }
