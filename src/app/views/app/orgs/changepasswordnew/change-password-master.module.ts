import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChangePasswordMasterRoutingModule } from './change-password-master-routing.module';
import { ChangepasswordnewComponent } from './changepasswordnew.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { TranslateModule } from '@ngx-translate/core';
import { CommonFilterModule } from '../../common-filter/common-filter.module';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';


@NgModule({
  declarations: [ChangepasswordnewComponent],
  imports: [
    CommonModule,
    ChangePasswordMasterRoutingModule,
    NgxUiLoaderModule,
    FormsModule,
    NgSelectModule,
    SimpleNotificationsModule.forRoot(),
    TranslateModule,
    CommonFilterModule,
    PagesContainersModule
  ]
})
export class ChangePasswordMasterModule { }
