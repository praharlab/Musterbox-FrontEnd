import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppVersionMasterRoutingModule } from './app-version-master-routing.module';
import { AppversionComponent } from './appversion.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [AppversionComponent],
  imports: [
    CommonModule,
    AppVersionMasterRoutingModule,
    ModalModule,
    FormsModule,
    TranslateModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class AppVersionMasterModule { }
