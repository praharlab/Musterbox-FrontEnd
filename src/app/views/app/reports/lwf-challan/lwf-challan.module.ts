import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LwfChallanRoutingModule } from './lwf-challan-routing.module';
import { LwfChallanComponent } from './lwf-challan.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SimpleNotificationsModule } from 'angular2-notifications';

@NgModule({
  declarations: [LwfChallanComponent],
  imports: [
    CommonModule,
    LwfChallanRoutingModule,
    NgxUiLoaderModule,
    LayoutContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    PdfViewerModule,
     SimpleNotificationsModule.forRoot()
  ],
})
export class LwfChallanModule {}
