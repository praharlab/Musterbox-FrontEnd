import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaveMasterRoutingModule } from './leave-master-routing.module';
import { ListLeaveMasterComponent } from './list-leave-master/list-leave-master.component';
import { AddLeaveMasterComponent } from './add-leave-master/add-leave-master.component';
import { EditLeaveMasterComponent } from './edit-leave-master/edit-leave-master.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [ListLeaveMasterComponent, AddLeaveMasterComponent, EditLeaveMasterComponent],
  imports: [
    CommonModule,
    LeaveMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    TranslateModule,
    SimpleNotificationsModule.forRoot(),
    FormsModule
  ]
})
export class LeaveMasterModule { }
