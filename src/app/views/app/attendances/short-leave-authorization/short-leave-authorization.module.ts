import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShortLeaveAuthorizationRoutingModule } from './short-leave-authorization-routing.module';
import { ListShortLeaveAuthorizationComponent } from './list-short-leave-authorization/list-short-leave-authorization.component';
import { FormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';


@NgModule({
  declarations: [ListShortLeaveAuthorizationComponent],
  imports: [
    CommonModule,
    ShortLeaveAuthorizationRoutingModule,
    FormsModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgSelectModule,
    TranslateModule,
    ModalModule,
    SimpleNotificationsModule.forRoot(),
    NgxDatatableModule,
    PaginationModule
  ]
})
export class ShortLeaveAuthorizationModule { }
