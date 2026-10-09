import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AutoMailSetupMasterRoutingModule } from './auto-mail-setup-master-routing.module';
import { ListAutoMailSetupComponent } from './list-auto-mail-setup/list-auto-mail-setup.component';
import { AddAutoMailSetupComponent } from './add-auto-mail-setup/add-auto-mail-setup.component';
import { EditAutoMailSetupComponent } from './edit-auto-mail-setup/edit-auto-mail-setup.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [ListAutoMailSetupComponent, AddAutoMailSetupComponent, EditAutoMailSetupComponent],
  imports: [
    CommonModule,
    AutoMailSetupMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class AutoMailSetupMasterModule { }
