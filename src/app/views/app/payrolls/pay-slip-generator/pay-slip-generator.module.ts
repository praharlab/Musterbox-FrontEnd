import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaySlipGeneratorRoutingModule } from './pay-slip-generator-routing.module';
import { PaySlipGeneratorComponent } from './pay-slip-generator.component';
import { ImportPaySlipGeneratorComponent } from './import-pay-slip-generator/import-pay-slip-generator.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CommonFilterModule } from '../../common-filter/common-filter.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [PaySlipGeneratorComponent, ImportPaySlipGeneratorComponent],
  imports: [
    CommonModule,
    PaySlipGeneratorRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    CommonFilterModule,
    SimpleNotificationsModule,
    PdfViewerModule,
    ModalModule
  ]
})
export class PaySlipGeneratorModule { }
