import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BulkSalaryPolicyMasterRoutingModule } from './bulk-salary-policy-master-routing.module';
import { BulkAddSalarypolicyComponent } from './bulk-add-salarypolicy.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [BulkAddSalarypolicyComponent],
  imports: [
    CommonModule,
    BulkSalaryPolicyMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    ModalModule,
    FormsModule,
    NgSelectModule,
    SimpleNotificationsModule.forRoot(),
    TranslateModule
  ]
})
export class BulkSalaryPolicyMasterModule { }
