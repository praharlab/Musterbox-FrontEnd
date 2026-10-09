import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BankMasterRoutingModule } from './bank-master-routing.module';
import { ListBankMasterComponent } from './list-bank-master/list-bank-master.component';
import { AddBankMasterComponent } from './add-bank-master/add-bank-master.component';
import { EditBankMasterComponent } from './edit-bank-master/edit-bank-master.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [ListBankMasterComponent, AddBankMasterComponent, EditBankMasterComponent],
  imports: [
    CommonModule,
    BankMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    TranslateModule,
    SimpleNotificationsModule.forRoot(),
    FormsModule
  ]
})
export class BankMasterModule { }
