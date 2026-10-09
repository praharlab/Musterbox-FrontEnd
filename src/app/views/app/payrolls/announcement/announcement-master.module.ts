import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnnouncementMasterRoutingModule } from './announcement-master-routing.module';
import { ListAnnouncementComponent } from './list-announcement/list-announcement.component';
import { AddAnnouncementComponent } from './add-announcement/add-announcement.component';
import { EditAnnouncementComponent } from './edit-announcement/edit-announcement.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { QuillModule } from 'ngx-quill';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [ListAnnouncementComponent, AddAnnouncementComponent, EditAnnouncementComponent],
  imports: [
    CommonModule,
    AnnouncementMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgSelectModule,
    FormsModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    QuillModule.forRoot(),
    SimpleNotificationsModule.forRoot()
  ]
})
export class AnnouncementMasterModule { }
