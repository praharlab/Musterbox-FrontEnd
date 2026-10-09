import { NgModule } from '@angular/core';
import { IncomeTaxRoutingModule } from './income-tax-routing';

import { IncomeTaxComponent } from './income-tax.component';
import { IncomeTaxMasterComponent } from './income-tax-master/income-tax-master.component';

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

import { ListEmployeeInvestmentsComponent } from './employee-investments/list-employee-investments/list-employee-investments.component';
import { AddEmployeeInvestmentsComponent } from './employee-investments/add-employee-investments/add-employee-investments.component';
import { EditEmployeeInvestmentsComponent } from './employee-investments/edit-employee-investments/edit-employee-investments.component';
@NgModule({
  declarations: [
    IncomeTaxComponent,
    IncomeTaxMasterComponent,
    ListEmployeeInvestmentsComponent,
    AddEmployeeInvestmentsComponent,
    EditEmployeeInvestmentsComponent,
  ],
  providers: [DatePipe],
  imports: [
    CommonModule,
    IncomeTaxRoutingModule,
    ModalModule,
    FormsModule,
    SharedModule,
    LayoutContainersModule,
    NgxDatatableModule,
    PagesContainersModule,
    CollapseModule,
    PaginationModule,
    NgSelectModule,
    SimpleNotificationsModule.forRoot(),
    NgxUiLoaderModule,
  ],
})

export class IncomeTaxModule { }
