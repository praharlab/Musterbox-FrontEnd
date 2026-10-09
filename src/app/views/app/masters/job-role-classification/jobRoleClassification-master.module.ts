import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { DesignationMasterRoutingModule } from './designation-master-routing.module';
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
import { JobRoleClassificationMasterRoutingModule } from './jobRoleClassification-master-routing.module';
import { ListJobRoleClassificationComponent } from './list-job-role-classification/list-job-role-classification.component';
import { AddJobRoleClassificationComponent } from './add-job-role-classification/add-job-role-classification.component';
import { EditJobRoleClassificationComponent } from './edit-job-role-classification/edit-job-role-classification.component';


@NgModule({
  declarations: [ListJobRoleClassificationComponent,AddJobRoleClassificationComponent, EditJobRoleClassificationComponent],
  imports: [
    CommonModule,
    JobRoleClassificationMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    TranslateModule,
    ModalModule,
    SimpleNotificationsModule.forRoot(),
    ComponentsStateButtonModule
  ]
})
export class JobRoleClassificationMasterModule { }
