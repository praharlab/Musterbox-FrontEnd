import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContractorMasterRoutingModule } from './contractor-master-routing.module';
import { ListContractorComponent } from './list-contractor/list-contractor.component';
import { AddContractorComponent } from './add-contractor/add-contractor.component';
import { EditContractorComponent } from './edit-contractor/edit-contractor.component';
import { ImportContractorComponent } from './import-contractor/import-contractor.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';


@NgModule({
  declarations: [ListContractorComponent, AddContractorComponent, EditContractorComponent, ImportContractorComponent],
  imports: [
    CommonModule,
    ContractorMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot(),
    ComponentsStateButtonModule,
  ]
})
export class ContractorMasterModule { }
