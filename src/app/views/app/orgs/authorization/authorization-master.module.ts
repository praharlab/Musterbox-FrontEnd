import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthorizationMasterRoutingModule } from './authorization-master-routing.module';
import { ListAuthorizationComponent } from './list-authorization/list-authorization.component';
import { AddAuthorizationComponent } from './add-authorization/add-authorization.component';
import { EditAuthorizationComponent } from './edit-authorization/edit-authorization.component';
import { ImportAuthorizationComponent } from '../import-authorization/import-authorization.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { FormsModule } from '@angular/forms';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [ListAuthorizationComponent, AddAuthorizationComponent, EditAuthorizationComponent, ImportAuthorizationComponent],
  imports: [
    CommonModule,
    AuthorizationMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    SimpleNotificationsModule.forRoot(),
    FormsModule,
    CommonFilterModule
  ]
})
export class AuthorizationMasterModule { }
