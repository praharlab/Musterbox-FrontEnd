import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthorizationMasterRoutingModule } from './authorization-master-routing.module';
import { ListAuthorizationmasterComponent } from './list-authorizationmaster/list-authorizationmaster.component';
import { AddAuthorizationmasterComponent } from './add-authorizationmaster/add-authorizationmaster.component';
import { EditAuthorizationmasterComponent } from './edit-authorizationmaster/edit-authorizationmaster.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [ListAuthorizationmasterComponent, AddAuthorizationmasterComponent, EditAuthorizationmasterComponent],
  imports: [
    CommonModule,
    AuthorizationMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    TranslateModule,
    SimpleNotificationsModule.forRoot(),
    FormsModule
  ]
})
export class AuthorizationMasterModule { }
