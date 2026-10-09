import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListIdCardMasterRoutingModule } from './list-id-card-master-routing.module';
import { ListIdCardComponent } from './list-id-card.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PdfViewerModule } from 'ng2-pdf-viewer';


@NgModule({
  declarations: [ListIdCardComponent],
  imports: [
    CommonModule,
    ListIdCardMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot(),
    PdfViewerModule
  ]
})
export class ListIdCardMasterModule { }
