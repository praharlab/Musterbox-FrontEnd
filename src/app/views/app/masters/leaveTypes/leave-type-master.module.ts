import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaveTypeMasterRoutingModule } from './leave-type-master-routing.module';
import { ListleaveTypesComponent } from './listleave-types/listleave-types.component';
import { AddleaveTypesComponent } from './addleave-types/addleave-types.component';
import { EditleaveTypesComponent } from './editleave-types/editleave-types.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [ListleaveTypesComponent, AddleaveTypesComponent, EditleaveTypesComponent],
  imports: [
    CommonModule,
    LeaveTypeMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgSelectModule,
    FormsModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot(),
    ComponentsStateButtonModule,
    ModalModule
  ]
})
export class LeaveTypeMasterModule { }
