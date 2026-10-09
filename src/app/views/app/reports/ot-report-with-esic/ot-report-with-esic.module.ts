import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OtReportWithEsicRoutingModule } from './ot-report-with-esic-routing.module';


import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { OtReportWithEsicComponent } from './ot-report-with-esic.component';


@NgModule({
  declarations: [OtReportWithEsicComponent],
  imports: [
    CommonModule,
    OtReportWithEsicRoutingModule,
    NgxUiLoaderModule,
    SimpleNotificationsModule.forRoot(),
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
  ]
})
export class OtReportWithEsicModule { }
