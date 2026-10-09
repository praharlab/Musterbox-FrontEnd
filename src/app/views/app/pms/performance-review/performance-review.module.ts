import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';

import { PerformanceReviewRoutingModule } from './performance-review.routing';
import { EditPerformanceReviewComponent } from './edit-performance-review/edit-performance-review.component';
import { ListPerformanceReviewComponent } from './list-performance-review/list-performance-review.component';
import { AddPerformanceReviewComponent } from './add-performance-review/add-performance-review.component';
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
import { PerformanceReviewComponent } from './performance-review.component';

@NgModule({
  declarations: [
    PerformanceReviewComponent,
    EditPerformanceReviewComponent,
    ListPerformanceReviewComponent,
    AddPerformanceReviewComponent,
  ],
  providers: [DatePipe],
  imports: [
    CommonModule,
    NgMultiSelectDropDownModule.forRoot(),
    PerformanceReviewRoutingModule,
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
  ],
})
export class PerformanceReviewModule {}
