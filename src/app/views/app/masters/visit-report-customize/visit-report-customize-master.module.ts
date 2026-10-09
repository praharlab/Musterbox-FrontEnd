import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisitReportCustomizeMasterRoutingModule } from './visit-report-customize-master-routing.module';
import { VisitReportCustomizeComponent } from './visit-report-customize.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { NgxSignaturePadModule } from 'src/app/components/signature-pad/ngx-signature-pad.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [VisitReportCustomizeComponent],
  imports: [
    CommonModule,
    VisitReportCustomizeMasterRoutingModule,
    NgxUiLoaderModule,
    LayoutContainersModule,
    NgSelectModule,
    FormsModule,
    NgxSignaturePadModule,
    ModalModule,
    SimpleNotificationsModule.forRoot(),
    TranslateModule
  ]
})
export class VisitReportCustomizeMasterModule { }
