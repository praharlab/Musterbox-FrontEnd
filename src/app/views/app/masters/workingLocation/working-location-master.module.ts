import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkingLocationMasterRoutingModule } from './working-location-master-routing.module';
import { ListWorkingLocationComponent } from './list-working-location/list-working-location.component';
import { AddWorkingLocationComponent } from './add-working-location/add-working-location.component';
import { EditWorkingLocationComponent } from './edit-working-location/edit-working-location.component';
import { ImportWorkingLocationComponent } from './import-working-location/import-working-location.component';
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
  declarations: [ListWorkingLocationComponent, AddWorkingLocationComponent, EditWorkingLocationComponent, ImportWorkingLocationComponent],
  imports: [
    CommonModule,
    WorkingLocationMasterRoutingModule,
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
export class WorkingLocationMasterModule { }
