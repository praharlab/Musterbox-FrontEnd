import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Form16MasterRoutingModule } from './form16-master-routing.module';
import { Form16Component } from './form16.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [Form16Component],
  imports: [
    CommonModule,
    Form16MasterRoutingModule,
    NgxUiLoaderModule,
    LayoutContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    PdfViewerModule,
    SimpleNotificationsModule.forRoot(),
    CommonFilterModule
  ]
})
export class Form16MasterModule { }
