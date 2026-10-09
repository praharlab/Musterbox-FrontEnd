import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OutdoorDutyMasterRoutingModule } from './outdoor-duty-master-routing.module';
import { ListMyOutdoorDutyComponent } from './list-my-outdoor-duty/list-my-outdoor-duty.component';
import { AddMyOutdoorDutyComponent } from './add-my-outdoor-duty/add-my-outdoor-duty.component';
import { EditMyOutdoorDutyComponent } from './edit-my-outdoor-duty/edit-my-outdoor-duty.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [ListMyOutdoorDutyComponent, AddMyOutdoorDutyComponent, EditMyOutdoorDutyComponent],
  imports: [
    CommonModule,
    OutdoorDutyMasterRoutingModule,
    NgxUiLoaderModule,
    SimpleNotificationsModule.forRoot(),
    PagesContainersModule,
    FormsModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    NgSelectModule,
  ]
})
export class OutdoorDutyMasterModule { }
