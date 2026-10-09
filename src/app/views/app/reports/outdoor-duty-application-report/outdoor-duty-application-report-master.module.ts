import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OutdoorDutyApplicationReportMasterRoutingModule } from './outdoor-duty-application-report-master-routing.module';
import { OutdoorDutyApplicationReportComponent } from './outdoor-duty-application-report.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [OutdoorDutyApplicationReportComponent],
  imports: [
    CommonModule,
    OutdoorDutyApplicationReportMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    CommonFilterModule
  ]
})
export class OutdoorDutyApplicationReportMasterModule { }
