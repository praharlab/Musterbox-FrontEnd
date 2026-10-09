import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KmReportMasterRoutingModule } from './km-report-master-routing.module';
import { KmReportComponent } from './km-report.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AgmDirectionModule } from 'src/app/components/agm/agm.module';
import { AgmCoreModule } from 'src/app/components/agm/agm.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [KmReportComponent],
  imports: [
    CommonModule,
    KmReportMasterRoutingModule,
    NgxUiLoaderModule,
    LayoutContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    PaginationModule,
    ModalModule,
    AgmDirectionModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAQyXIWhOoRo6rj0PcaYdEbVTSiu2EHiq4',
    }),
    SimpleNotificationsModule.forRoot(),
    PagesContainersModule,
    CommonFilterModule
  ]
})
export class KmReportMasterModule { }
