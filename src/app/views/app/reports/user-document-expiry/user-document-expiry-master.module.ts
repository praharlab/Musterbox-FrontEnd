import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserDocumentExpiryMasterRoutingModule } from './user-document-expiry-master-routing.module';
import { UserDocumentExpiryComponent } from './user-document-expiry.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [UserDocumentExpiryComponent],
  imports: [
    CommonModule,
    UserDocumentExpiryMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class UserDocumentExpiryMasterModule { }
