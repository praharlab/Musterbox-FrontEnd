import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserIpMasterRoutingModule } from './user-ip-master-routing.module';
import { ListUserIpComponent } from './list-user-ip/list-user-ip.component';
import { AddUserIpComponent } from './add-user-ip/add-user-ip.component';
import { EditUserIpComponent } from './edit-user-ip/edit-user-ip.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [ListUserIpComponent, AddUserIpComponent, EditUserIpComponent ],
  imports: [
    CommonModule,
    UserIpMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class UserIpMasterModule { }
