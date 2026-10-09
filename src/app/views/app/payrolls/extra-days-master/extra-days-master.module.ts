import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExtraDaysMasterRoutingModule } from './extra-days-master-routing.module';
import { ListExtraDaysComponent } from './list-extra-days/list-extra-days.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [ListExtraDaysComponent],
  imports: [
    CommonModule,
    ExtraDaysMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    ModalModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot(),
    CommonFilterModule
  ]
})
export class ExtraDaysMasterModule { }
