import { NgModule } from '@angular/core';
import { UtilitysComponent } from './utilitys.component';
import { UtilitysRoutingModule } from './utilitys.routing';
import { ListLetterEditorComponent } from './LetterEditorTemplate/list-letter-editor/list-letter-editor.component';
import { AddLetterEditorComponent } from './LetterEditorTemplate/add-letter-editor/add-letter-editor.component';
import { UtilityMasterComponent } from './utility-master/utility-master.component';
import { EditLetterEditorComponent } from './LetterEditorTemplate/edit-letter-editor/edit-letter-editor.component';

import { CommonModule, DatePipe } from '@angular/common';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { QuillModule } from 'ngx-quill';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { PagesContainersModule } from '../../../containers/pages/pages.containers.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { ComponentsChartModule } from 'src/app/components/charts/components.charts.module';
import { AgmCoreModule } from 'src/app/components/agm/agm.module';
import { AddDiscrepancyLetterComponent } from './discrepancyLetter/add-discrepancy-letter/add-discrepancy-letter.component';
import { EditDiscrepancyLetterComponent } from './discrepancyLetter/edit-discrepancy-letter/edit-discrepancy-letter.component';
import { ListDiscrepancyLetterComponent } from './discrepancyLetter/list-discrepancy-letter/list-discrepancy-letter.component';

@NgModule({
  declarations: [
    UtilitysComponent,
    UtilityMasterComponent,
    AddLetterEditorComponent,
    EditLetterEditorComponent,
    ListLetterEditorComponent,
    AddDiscrepancyLetterComponent,
    EditDiscrepancyLetterComponent,
    ListDiscrepancyLetterComponent,

  ],
  providers: [DatePipe],
  imports: [
    CommonModule,
    UtilitysRoutingModule,
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
    QuillModule.forRoot(),
    NgxUiLoaderModule,
    ComponentsStateButtonModule,
    PdfViewerModule,
    ComponentsChartModule,
  ],
})
export class UtilitysModule { }
