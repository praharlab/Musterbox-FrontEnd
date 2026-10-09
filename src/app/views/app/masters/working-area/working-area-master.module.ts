import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkingAreaMasterRoutingModule } from './working-area-master-routing.module';
import { ListWorkingAreaComponent } from './list-working-area/list-working-area.component';
import { AddWorkingAreaComponent } from './add-working-area/add-working-area.component';
import { EditWorkingAreaComponent } from './edit-working-area/edit-working-area.component';
import { ImportWorkingAreaComponent } from './import-working-area/import-working-area.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';


@NgModule({
  declarations: [ListWorkingAreaComponent, AddWorkingAreaComponent, EditWorkingAreaComponent, ImportWorkingAreaComponent],
  imports: [
    CommonModule,
    WorkingAreaMasterRoutingModule,
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
export class WorkingAreaMasterModule { }
