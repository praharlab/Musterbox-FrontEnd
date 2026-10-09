import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BiometricIntegrationMasterRoutingModule } from './biometric-integration-master-routing.module';
import { ListBiometricIntegrationComponent } from './list-biometric-integration/list-biometric-integration.component';
import { AddBiometricIntegrationComponent } from './add-biometric-integration/add-biometric-integration.component';
import { EditBiometricIntegrationComponent } from './edit-biometric-integration/edit-biometric-integration.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [ListBiometricIntegrationComponent, AddBiometricIntegrationComponent, EditBiometricIntegrationComponent],
  imports: [
    CommonModule,
    BiometricIntegrationMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgSelectModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot(),
    ModalModule,
    FormsModule,
    TranslateModule
  ]
})
export class BiometricIntegrationMasterModule { }
