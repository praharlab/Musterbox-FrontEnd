import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PendingBiometricSyncMasterRoutingModule } from './pending-biometric-sync-master-routing.module';
import { PendingBiometricSyncComponent } from './pending-biometric-sync.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [PendingBiometricSyncComponent],
  imports: [
    CommonModule,
    PendingBiometricSyncMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule
  ]
})
export class PendingBiometricSyncMasterModule { }
