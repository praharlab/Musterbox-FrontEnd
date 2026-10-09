import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompensatoryOffMasterRoutingModule } from './compensatory-off-master-routing.module';
import { MyCompensatoryOffComponent } from './my-compensatory-off.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [MyCompensatoryOffComponent],
  imports: [
    CommonModule,
    CompensatoryOffMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot(),
    ModalModule
  ]
})
export class CompensatoryOffMasterModule { }
