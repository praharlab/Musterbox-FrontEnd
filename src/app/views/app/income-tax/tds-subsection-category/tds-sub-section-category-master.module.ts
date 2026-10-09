import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdsSubSectionCategoryMasterRoutingModule } from './tds-sub-section-category-master-routing.module';
import { TdsSubsectionCategoryComponent } from './tds-subsection-category.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [TdsSubsectionCategoryComponent],
  imports: [
    CommonModule,
    TdsSubSectionCategoryMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    FormsModule,
    TranslateModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class TdsSubSectionCategoryMasterModule { }
