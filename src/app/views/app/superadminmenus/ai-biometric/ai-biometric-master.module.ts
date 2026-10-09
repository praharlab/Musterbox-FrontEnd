import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AiBiometricMasterRoutingModule } from './ai-biometric-master-routing.module';
import { AiBiometricComponent } from './ai-biometric.component';
import { AddAiBiometricComponent } from './add-ai-biometric/add-ai-biometric.component';
import { EditAiBiometricComponent } from './edit-ai-biometric/edit-ai-biometric.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [AiBiometricComponent, AddAiBiometricComponent, EditAiBiometricComponent],
  imports: [
    CommonModule,
    AiBiometricMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot(),
    FormsModule,
    TranslateModule
  ]
})
export class AiBiometricMasterModule { }
