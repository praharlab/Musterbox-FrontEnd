import { NgModule } from '@angular/core';

import { SuperadminmenusRoutingModule } from './superadminmenus.routing';

import { SuperadminMenuComponent } from './superadmin-menu/superadmin-menu.component';
import { SuperadminmenusComponent } from './superadminmenus.component';
import { SubadminCompanyMasterComponent } from './subadmin-company-master/subadmin-company-master.component';

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
import { MastersModule } from '../masters/masters.module';
import { ListSubscriptionPlanAnalytictsComponent } from './list-subscription-plan-analyticts/list-subscription-plan-analyticts.component';
import { TotalPunchInAllcompanyComponent } from './total-punch-in-allcompany/total-punch-in-allcompany.component';

import { ListCompanyProgressComponent } from './company-progress/list-company-progress/list-company-progress.component';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { ListCompanyTrainingComponent } from './company-Training/list-company-training/list-company-training.component';
import { AddCompanyTrainingComponent } from './company-Training/add-company-training/add-company-training.component';
import { EditCompanyTrainingComponent } from './company-Training/edit-company-training/edit-company-training.component';
// import {
//   CdkDrag,
//   CdkDropList,
// } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    SuperadminmenusComponent,
    SuperadminMenuComponent,
    SubadminCompanyMasterComponent,

    ListSubscriptionPlanAnalytictsComponent,
    TotalPunchInAllcompanyComponent,
    ListCompanyProgressComponent,
    ListCompanyTrainingComponent,
    AddCompanyTrainingComponent,
    EditCompanyTrainingComponent,
  ],
  providers: [DatePipe],
  imports: [
    CommonModule,
    AngularDualListBoxModule,
    NgMultiSelectDropDownModule.forRoot(),
    SuperadminmenusRoutingModule,
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
    MastersModule,
    DragDropModule
  ],
})
export class SuperadminmenusModule { }
