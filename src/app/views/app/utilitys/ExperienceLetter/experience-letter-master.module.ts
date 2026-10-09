import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExperienceLetterMasterRoutingModule } from './experience-letter-master-routing.module';
import { ListExperienceLetterComponent } from './list-experience-letter/list-experience-letter.component';
import { AddExperienceLetterComponent } from './add-experience-letter/add-experience-letter.component';
import { EditExperienceLetterComponent } from './edit-experience-letter/edit-experience-letter.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { QuillModule } from 'ngx-quill';


@NgModule({
  declarations: [ListExperienceLetterComponent, AddExperienceLetterComponent, EditExperienceLetterComponent],
  imports: [
    CommonModule,
    ExperienceLetterMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    SimpleNotificationsModule.forRoot(),
    QuillModule.forRoot()
  ]
})
export class ExperienceLetterMasterModule { }
