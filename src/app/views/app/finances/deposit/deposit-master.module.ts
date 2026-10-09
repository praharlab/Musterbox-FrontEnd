import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepositMasterRoutingModule } from './deposit-master-routing.module';
import { ListDepositComponent } from './list-deposit/list-deposit.component';
import { AddDepositComponent } from './add-deposit/add-deposit.component';
import { EditDepositComponent } from './edit-deposit/edit-deposit.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [ListDepositComponent, AddDepositComponent, EditDepositComponent],
  imports: [
    CommonModule,
    DepositMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgSelectModule,
    FormsModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    SimpleNotificationsModule.forRoot(),
    ComponentsStateButtonModule,
    CommonFilterModule
  ]
})
export class DepositMasterModule { }
