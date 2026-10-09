import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpLeaveMasterRoutingModule } from './emp-leave-master-routing.module';
import { ListempLeaveComponent } from './listemp-leave/listemp-leave.component';
import { AddempLeaveComponent } from './addemp-leave/addemp-leave.component';
import { EditempLeaveComponent } from './editemp-leave/editemp-leave.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [ListempLeaveComponent, AddempLeaveComponent, EditempLeaveComponent],
  imports: [
    CommonModule,
    EmpLeaveMasterRoutingModule,
    NgxUiLoaderModule,
    SimpleNotificationsModule.forRoot(),
    PagesContainersModule,
    NgSelectModule,
    FormsModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
  ]
})
export class EmpLeaveMasterModule { }
