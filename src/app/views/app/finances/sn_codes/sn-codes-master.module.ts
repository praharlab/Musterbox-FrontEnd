import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SnCodesMasterRoutingModule } from './sn-codes-master-routing.module';
import { ListSncodesComponent } from './list-sncodes/list-sncodes.component';
import { AddSncodesComponent } from './add-sncodes/add-sncodes.component';
import { EditSncodesComponent } from './edit-sncodes/edit-sncodes.component';
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
  declarations: [ListSncodesComponent, AddSncodesComponent, EditSncodesComponent],
  imports: [
    CommonModule,
    SnCodesMasterRoutingModule,
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
export class SnCodesMasterModule { }
