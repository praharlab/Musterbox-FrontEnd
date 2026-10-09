import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeGatepassMasterRoutingModule } from './employee-gatepass-master-routing.module';
import { ListEmployeeGatepassComponent } from './list-employee-gatepass/list-employee-gatepass.component';
import { AddEmployeeGatepassComponent } from './add-employee-gatepass/add-employee-gatepass.component';
import { EditEmployeeGatepassComponent } from './edit-employee-gatepass/edit-employee-gatepass.component';
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
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [ListEmployeeGatepassComponent, AddEmployeeGatepassComponent, EditEmployeeGatepassComponent],
  imports: [
    CommonModule,
    EmployeeGatepassMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    SimpleNotificationsModule.forRoot(),
    ComponentsStateButtonModule,
    CommonFilterModule
  ]
})
export class EmployeeGatepassMasterModule { }
