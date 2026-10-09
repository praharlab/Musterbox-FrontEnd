import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BulkWeekoffPolicyMasterRoutingModule } from './bulk-weekoff-policy-master-routing.module';
import { BulkAddWeekoffpolicyComponent } from './bulk-add-weekoffpolicy.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [BulkAddWeekoffpolicyComponent],
  imports: [
    CommonModule,
    BulkWeekoffPolicyMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    TranslateModule,
    PaginationModule,
    ModalModule,
    FormsModule,
    NgSelectModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class BulkWeekoffPolicyMasterModule { }
