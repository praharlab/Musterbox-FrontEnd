import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyGatepassMasterRoutingModule } from './my-gatepass-master-routing.module';
import { ListMyGatepassComponent } from './list-my-gatepass/list-my-gatepass.component';
import { AddMyGatepassComponent } from './add-my-gatepass/add-my-gatepass.component';
import { EditMyGatepassComponent } from './edit-my-gatepass/edit-my-gatepass.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';


@NgModule({
  declarations: [ListMyGatepassComponent, AddMyGatepassComponent, EditMyGatepassComponent],
  imports: [
    CommonModule,
    MyGatepassMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    SimpleNotificationsModule.forRoot(),
    ComponentsStateButtonModule
  ]
})
export class MyGatepassMasterModule { }
