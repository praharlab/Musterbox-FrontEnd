import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResignationListMasterRoutingModule } from './resignation-list-master-routing.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { ResignationListComponent } from './resignation-list.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [ResignationListComponent],
  imports: [
    CommonModule,
    ResignationListMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    NgxDatatableModule,
    PaginationModule,
    TranslateModule,
    ModalModule,
    SimpleNotificationsModule.forRoot(),
  ]
})
export class ResignationListMasterModule { }
