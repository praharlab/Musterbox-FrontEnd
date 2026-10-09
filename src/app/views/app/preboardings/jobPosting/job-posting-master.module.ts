import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobPostingMasterRoutingModule } from './job-posting-master-routing.module';
import { ListJobPostingComponent } from './list-job-posting/list-job-posting.component';
import { AddJobPostingComponent } from './add-job-posting/add-job-posting.component';
import { EditJobPostingComponent } from './edit-job-posting/edit-job-posting.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { QRCodeComponent } from 'angularx-qrcode';
import { QuillModule } from 'ngx-quill';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [ListJobPostingComponent, AddJobPostingComponent, EditJobPostingComponent],
  imports: [
    CommonModule,
    JobPostingMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    QRCodeComponent,
    QuillModule.forRoot(),
    SimpleNotificationsModule.forRoot()
  ]
})
export class JobPostingMasterModule { }
