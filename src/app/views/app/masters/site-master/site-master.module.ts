import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SiteMasterRoutingModule } from './site-master-routing.module';
import { AddSiteComponent } from './add-site/add-site.component';
import { EditSiteComponent } from './edit-site/edit-site.component';
import { ListSiteComponent } from './list-site/list-site.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';

@NgModule({
  declarations: [AddSiteComponent, EditSiteComponent, ListSiteComponent],
  imports: [
    CommonModule,
    SiteMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgSelectModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    FormsModule,
    SimpleNotificationsModule.forRoot(),
    ComponentsStateButtonModule,
  ],
})
export class SiteMasterModule {}
