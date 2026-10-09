import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyMasterRoutingModule } from './company-master-routing.module';
import { ListCompanyMasterComponent } from './list-company-master/list-company-master.component';
import { AddCompanyMasterComponent } from './add-company-master/add-company-master.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ViewCompanyMasterComponent } from './view-company-master/view-company-master.component';
import { EditCompanyMasterComponent } from './edit-company-master/edit-company-master.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';


@NgModule({
  declarations: [ListCompanyMasterComponent, AddCompanyMasterComponent, ViewCompanyMasterComponent, EditCompanyMasterComponent],
  imports: [
    CommonModule,
    CompanyMasterRoutingModule,
    FormsModule,
    TranslateModule,
    NgSelectModule,
    NgxUiLoaderModule,
    ComponentsStateButtonModule,
    SimpleNotificationsModule.forRoot(),
    PagesContainersModule,
    NgxDatatableModule,
    ModalModule,
    PaginationModule 
  ]
})
export class CompanyMasterModule { }
