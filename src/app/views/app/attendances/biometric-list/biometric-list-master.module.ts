import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BiometricListMasterRoutingModule } from './biometric-list-master-routing.module';
import { BiometricListComponent } from './biometric-list.component';
import { AddBiometricListComponent } from '../add-biometric-list/add-biometric-list.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [BiometricListComponent, AddBiometricListComponent],
  imports: [
    CommonModule,
    BiometricListMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    SimpleNotificationsModule.forRoot(),
    TranslateModule
  ]
})
export class BiometricListMasterModule { }
