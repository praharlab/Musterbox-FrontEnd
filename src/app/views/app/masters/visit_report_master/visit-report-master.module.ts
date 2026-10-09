import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisitReportMasterRoutingModule } from './visit-report-master-routing.module';
import { ViewVisitReportMasterComponent } from './view-visit-report-master/view-visit-report-master.component';
import { AddVisitReportMasterComponent } from './add-visit-report-master/add-visit-report-master.component';
import { EditVisitReportMasterComponent } from './edit-visit-report-master/edit-visit-report-master.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';


@NgModule({
  declarations: [ViewVisitReportMasterComponent, AddVisitReportMasterComponent, EditVisitReportMasterComponent],
  imports: [
    CommonModule,
    VisitReportMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgSelectModule,
    FormsModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot(),
    ComponentsStateButtonModule,
  ]
})
export class VisitReportMasterModule { }
