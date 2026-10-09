import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InoutAttendancRegisterMasterRoutingModule } from './inout-attendanc-register-master-routing.module';
import { InoutAttendanceRegisterComponent } from './inout-attendance-register.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPrintModule } from 'ngx-print';


@NgModule({
  declarations: [InoutAttendanceRegisterComponent],
  imports: [
    CommonModule,
    InoutAttendancRegisterMasterRoutingModule,
    NgxUiLoaderModule,
    LayoutContainersModule,
    SimpleNotificationsModule.forRoot(),
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxPrintModule
  ]
})
export class InoutAttendancRegisterMasterModule { }
