import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShortLeaveApplicationMasterRoutingModule } from './short-leave-application-master-routing.module';
import { MyShortLeaveApplicationComponent } from './list-my-short-leave-application/my-short-leave-application.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AddShortLeaveApplicationComponent } from './add-short-leave-application/add-short-leave-application.component';
import { EditShortLeaveApplicationComponent } from './edit-short-leave-application/edit-short-leave-application.component';


@NgModule({
  declarations: [MyShortLeaveApplicationComponent, AddShortLeaveApplicationComponent, EditShortLeaveApplicationComponent],
  imports: [
    CommonModule,
    ShortLeaveApplicationMasterRoutingModule,
    NgxUiLoaderModule,
    SimpleNotificationsModule.forRoot(),
    PagesContainersModule,
    FormsModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    
  ]
})
export class ShortLeaveApplicationMasterModule { }
