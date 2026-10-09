import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErpAccountMasterRoutingModule } from './erp-account-master-routing.module';
import { ListErpAccountMasterComponent } from './list-erp-account-master/list-erp-account-master.component';
import { AddErpAccountMasterComponent } from './add-erp-account-master/add-erp-account-master.component';
import { EditErpAccountMasterComponent } from './edit-erp-account-master/edit-erp-account-master.component';
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
  declarations: [ListErpAccountMasterComponent, AddErpAccountMasterComponent, EditErpAccountMasterComponent],
  imports: [
    CommonModule,
    ErpAccountMasterRoutingModule,
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
export class ErpAccountMasterModule { }
