import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PreboardingFormMasterRoutingModule } from './preboarding-form-master-routing.module';
import { ListPreboardingFormComponent } from './list-preboarding-form/list-preboarding-form.component';
import { AddPreboardingFormComponent } from './add-preboarding-form/add-preboarding-form.component';
import { EditPreboardingFormComponent } from './edit-preboarding-form/edit-preboarding-form.component';
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
import { ViewPreboardingCommonModule } from '../preboarding/view-preboarding-common/view-preboarding-common.module';


@NgModule({
  declarations: [ListPreboardingFormComponent, AddPreboardingFormComponent, EditPreboardingFormComponent],
  imports: [
    CommonModule,
    PreboardingFormMasterRoutingModule,
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
    ViewPreboardingCommonModule
  ]
})
export class PreboardingFormMasterModule { }
