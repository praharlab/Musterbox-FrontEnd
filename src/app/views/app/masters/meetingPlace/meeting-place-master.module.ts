import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MeetingPlaceMasterRoutingModule } from './meeting-place-master-routing.module';
import { ListMeetingPlaceComponent } from './list-meeting-place/list-meeting-place.component';
import { AddMeetingPlaceComponent } from './add-meeting-place/add-meeting-place.component';
import { EditMeetingPlaceComponent } from './edit-meeting-place/edit-meeting-place.component';
import { ImportMeetingPlaceComponent } from './import-meeting-place/import-meeting-place.component';
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
  declarations: [ListMeetingPlaceComponent, AddMeetingPlaceComponent, EditMeetingPlaceComponent, ImportMeetingPlaceComponent],
  imports: [
    CommonModule,
    MeetingPlaceMasterRoutingModule,
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
export class MeetingPlaceMasterModule { }
