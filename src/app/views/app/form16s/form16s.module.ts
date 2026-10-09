import { NgModule } from '@angular/core';

import { Form16sRoutingModule } from './form16s.routing';

import { Form16sComponent } from './form16s.component';
import { Form16MasterComponent } from './form16-master/form16-master.component';
import { ListTdsSlabComponent } from './tds_slab/list-tds-slab/list-tds-slab.component';
import { AddEmployeeInvestmentComponent } from './employee-investment/add-employee-investment/add-employee-investment.component';
import { EditEmployeeInvestmentComponent } from './employee-investment/edit-employee-investment/edit-employee-investment.component';
import { ListEmployeeInvestmentComponent } from './employee-investment/list-employee-investment/list-employee-investment.component';
import { Form16reportComponent } from './form16report/form16report.component';
import { AddQuaterTaxChallanComponent } from './quater_tax_challan/add-quater-tax-challan/add-quater-tax-challan.component';
import { EditQuaterTaxChallanComponent } from './quater_tax_challan/edit-quater-tax-challan/edit-quater-tax-challan.component';
import { ListQuaterTaxChallanComponent } from './quater_tax_challan/list-quater-tax-challan/list-quater-tax-challan.component';
import { AddTaxChallanComponent } from './tax_challan/add-tax-challan/add-tax-challan.component';
import { EditTaxChallanComponent } from './tax_challan/edit-tax-challan/edit-tax-challan.component';
import { ListTaxChallanComponent } from './tax_challan/list-tax-challan/list-tax-challan.component';
import { AddTdsSlabComponent } from './tds_slab/add-tds-slab/add-tds-slab.component';
import { EditTdsSlabComponent } from './tds_slab/edit-tds-slab/edit-tds-slab.component';

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

@NgModule({
  declarations: [
    Form16sComponent,
    Form16MasterComponent,
    ListEmployeeInvestmentComponent,
    AddEmployeeInvestmentComponent,
    EditEmployeeInvestmentComponent,
    ListTaxChallanComponent,
    AddTaxChallanComponent,
    EditTaxChallanComponent,
    ListQuaterTaxChallanComponent,
    AddQuaterTaxChallanComponent,
    EditQuaterTaxChallanComponent,
    ListTdsSlabComponent,
    AddTdsSlabComponent,
    EditTdsSlabComponent,
    Form16reportComponent,
  ],

  providers: [DatePipe],
  imports: [
    CommonModule,
    AngularDualListBoxModule,
    NgMultiSelectDropDownModule.forRoot(),
    Form16sRoutingModule,
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
  ],
})
export class Form16sModule {}
