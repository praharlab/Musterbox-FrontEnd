import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyPaySlipRoutingModule } from './my-pay-slip-routing.module';
import { MyPaySlipComponent } from './my-pay-slip.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';


@NgModule({
  declarations: [MyPaySlipComponent],
  imports: [
    CommonModule,
    MyPaySlipRoutingModule,
        NgxUiLoaderModule,
        PagesContainersModule,
        FormsModule,
        TranslateModule,
        NgxDatatableModule,
        PaginationModule,
        ModalModule,
        PdfViewerModule
  ]
})
export class MyPaySlipModule { }
