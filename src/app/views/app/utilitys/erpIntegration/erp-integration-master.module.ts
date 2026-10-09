import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErpIntegrationMasterRoutingModule } from './erp-integration-master-routing.module';
import { ListErpIntegrationComponent } from './list-erp-integration/list-erp-integration.component';
import { AddErpIntegrationComponent } from './add-erp-integration/add-erp-integration.component';
import { EditErpIntegrationComponent } from './edit-erp-integration/edit-erp-integration.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [ListErpIntegrationComponent, AddErpIntegrationComponent, EditErpIntegrationComponent],
  imports: [
    CommonModule,
    ErpIntegrationMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class ErpIntegrationMasterModule { }
