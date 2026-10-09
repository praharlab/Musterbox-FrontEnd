import { EmloyeePerformanceReviewRoutingModule } from './emloyee-performance-review.routing';
import { ListEmployeePerformanceReviewComponent } from './list-employee-performance-review/list-employee-performance-review.component';
import { AddEmployeePerformanceReviewComponent } from './add-employee-performance-review/add-employee-performance-review.component';
import { EditEmployeePerformanceReviewComponent } from './edit-employee-performance-review/edit-employee-performance-review.component';
import { EmloyeePerformanceReviewComponent } from './emloyee-performance-review.component';

import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';

import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';

import { NgCircleProgressModule } from 'ng-circle-progress';
import { NgxPrintModule } from 'ngx-print';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { QuillModule } from 'ngx-quill';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
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
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { DashboardsContainersModule } from 'src/app/containers/dashboards/dashboards.containers.module';
import { RatingModule } from 'ngx-bootstrap/rating';
import { BootstrapModule } from 'src/app/components/bootstrap/bootstrap.module';

@NgModule({
  declarations: [
    ListEmployeePerformanceReviewComponent,
    AddEmployeePerformanceReviewComponent,
    EditEmployeePerformanceReviewComponent,
    EmloyeePerformanceReviewComponent,
  ],
  providers: [DatePipe],
  imports: [
    CommonModule,
    NgMultiSelectDropDownModule.forRoot(),
    EmloyeePerformanceReviewRoutingModule,
    FormsModule,
    NgxDatatableModule,
    PagesContainersModule,
    SimpleNotificationsModule.forRoot(),
    NgxUiLoaderModule,
    ModalModule,
    SharedModule,
    LayoutContainersModule,
    CollapseModule,
    PaginationModule,
    TabsModule,
    TooltipModule,
    NgSelectModule,
    QuillModule.forRoot(),
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
    DashboardsContainersModule,
    RatingModule,
    BootstrapModule,
  ],
})
export class EmloyeePerformanceReviewModule {}
