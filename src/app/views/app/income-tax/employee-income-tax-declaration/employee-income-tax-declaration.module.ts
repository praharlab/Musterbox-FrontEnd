
import { NgModule } from '@angular/core';

import { EmployeeIncomeTaxDeclarationRoutingModule } from './employee-income-tax-declaration-routing.module';


import { CommonModule, DatePipe } from '@angular/common';
import { LayoutContainersModule } from '../../../../../../src/app/containers/layout/layout.containers.module';
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
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxSignaturePadModule } from 'src/app/components/signature-pad/ngx-signature-pad.module';
import { QRCodeComponent } from 'angularx-qrcode';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SharedModule } from '../../../../../../src/app/shared/shared.module';
import { ComponentsStateButtonModule } from '../../../../../../src/app/components/state-button/components.state-button.module';
import { ComponentsChartModule } from '../../../../../../src/app/components/charts/components.charts.module';
import { AgmCoreModule } from 'src/app/components/agm/agm.module';
import { BnNgTreeModule } from 'src/app/components/bn-ng-tree/bn-ng-tree.module';
import { AgmDirectionModule } from 'src/app/components/agm/agm.module';
import { PagesContainersModule } from '../../../../../../src/app/containers/pages/pages.containers.module';
import { DeclarationComponent } from './declaration/declaration.component';
import { EmployeeIncomeTaxDeclarationComponent } from './employee-income-tax-declaration.component';
import { DeclarationInformationComponent } from './declaration-information/declaration-information.component';
import { EmployeeDeclarationComponent } from './employee-declaration/employee-declaration.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { EmployeeDeclarationDeductionsAlloancesComponent } from './employee-declaration-deductions-alloances/employee-declaration-deductions-alloances.component';

import { IncomeTaxComputationComponent } from './income-tax-computation/income-tax-computation.component';
import { EmployeeHousePropertyComponent } from './employee-house-property/employee-house-property.component';
import { CommonFilterModule } from '../../common-filter/common-filter.module';




@NgModule({
  declarations: [
    DeclarationComponent,
    EmployeeIncomeTaxDeclarationComponent,
    DeclarationInformationComponent,
    EmployeeDeclarationComponent,
    EmployeeDeclarationDeductionsAlloancesComponent,
    IncomeTaxComputationComponent,
    EmployeeHousePropertyComponent,

  ],
  providers: [DatePipe],
  imports: [
    CommonModule,
    AngularDualListBoxModule,
    NgMultiSelectDropDownModule.forRoot(),
    EmployeeIncomeTaxDeclarationRoutingModule,
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
    BsDropdownModule,
    CommonFilterModule

  ],
})
export class EmployeeIncomeTaxDeclarationModule { }

