import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EsicChallanMasterRoutingModule } from './esic-challan-master-routing.module';
import { EsicChallanComponent } from './esic-challan.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';


@NgModule({
  declarations: [EsicChallanComponent],
  imports: [
    CommonModule,
    EsicChallanMasterRoutingModule,
    NgxUiLoaderModule,
    LayoutContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    PdfViewerModule
  ]
})
export class EsicChallanMasterModule { }
