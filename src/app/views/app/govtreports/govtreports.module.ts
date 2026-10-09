import { NgModule } from '@angular/core';

import { GovtreportsComponent } from './govtreports.component';
import { GovReportMasterComponent } from './gov-report-master/gov-report-master.component';

import { GovtreportsRoutingModule } from './govtreports.routing';
import { CommonModule, DatePipe } from '@angular/common';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PagesContainersModule } from '../../../containers/pages/pages.containers.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormDComponent } from './form-d/form-d.component';

@NgModule({
  declarations: [
    GovtreportsComponent,
    GovReportMasterComponent,
    FormDComponent,
  ],
  providers: [DatePipe],
  imports: [
    CommonModule,
    GovtreportsRoutingModule,
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
export class GovtreportsModule { }
