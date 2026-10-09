import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShortLeaveCancellationMasterRoutingModule } from './short-leave-cancellation-master-routing.module';
import { ShortLeaveCancellationComponent } from './short-leave-cancellation.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [ShortLeaveCancellationComponent],
  imports: [
    CommonModule,
    ShortLeaveCancellationMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot(),
    ModalModule,
    CommonFilterModule
  ]
})
export class ShortLeaveCancellationMasterModule { }
