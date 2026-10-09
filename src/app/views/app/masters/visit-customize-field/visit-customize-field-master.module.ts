import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisitCustomizeFieldMasterRoutingModule } from './visit-customize-field-master-routing.module';
import { VisitCustomizeFieldComponent } from './visit-customize-field.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [VisitCustomizeFieldComponent],
  imports: [
    CommonModule,
    VisitCustomizeFieldMasterRoutingModule,
    NgxUiLoaderModule,
    LayoutContainersModule,
    NgSelectModule,
    FormsModule,
    ModalModule,
    TranslateModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class VisitCustomizeFieldMasterModule { }
