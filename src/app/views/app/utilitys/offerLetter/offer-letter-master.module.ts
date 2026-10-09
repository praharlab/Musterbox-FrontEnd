import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfferLetterMasterRoutingModule } from './offer-letter-master-routing.module';
import { ListOfferletterComponent } from './list-offerletter/list-offerletter.component';
import { AddOfferletterComponent } from './add-offerletter/add-offerletter.component';
import { EditOfferletterComponent } from './edit-offerletter/edit-offerletter.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { QuillModule } from 'ngx-quill';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [ListOfferletterComponent, AddOfferletterComponent, EditOfferletterComponent],
  imports: [
    CommonModule,
    OfferLetterMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    QuillModule.forRoot(),
    SimpleNotificationsModule.forRoot()
  ]
})
export class OfferLetterMasterModule { }
