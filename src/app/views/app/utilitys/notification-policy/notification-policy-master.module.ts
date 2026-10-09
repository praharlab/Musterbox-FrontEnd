import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationPolicyMasterRoutingModule } from './notification-policy-master-routing.module';
import { NotificationPolicyComponent } from './notification-policy.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [NotificationPolicyComponent],
  imports: [
    CommonModule,
    NotificationPolicyMasterRoutingModule,
    NgxUiLoaderModule,
    FormsModule,
    NgSelectModule,
    SimpleNotificationsModule.forRoot(),
    TranslateModule
  ]
})
export class NotificationPolicyMasterModule { }
