import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyGatepassMasterRoutingModule } from './my-gatepass-master-routing.module';
import { GatepassByUserComponent } from './gatepass-by-user/gatepass-by-user.component';
import { AddMygatepassComponent } from './add-mygatepass/add-mygatepass.component';
import { EditMygatepassComponent } from './edit-mygatepass/edit-mygatepass.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';


@NgModule({
  declarations: [GatepassByUserComponent, AddMygatepassComponent, EditMygatepassComponent],
  imports: [
    CommonModule,
    MyGatepassMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgSelectModule,
    FormsModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    SimpleNotificationsModule.forRoot(),
    ComponentsStateButtonModule
  ]
})
export class MyGatepassMasterModule { }
