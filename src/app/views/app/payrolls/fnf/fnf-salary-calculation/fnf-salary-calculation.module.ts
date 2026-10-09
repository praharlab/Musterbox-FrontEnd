import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FnfSalaryCalculationComponent } from './fnf-salary-calculation.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';



@NgModule({
  declarations: [FnfSalaryCalculationComponent],
  imports: [
    CommonModule,
    ModalModule,
    FormsModule,
    PdfViewerModule,
    NgxUiLoaderModule,
    SimpleNotificationsModule.forRoot(),
    PagesContainersModule,
    TranslateModule,
    LayoutContainersModule,
    ComponentsStateButtonModule
  ],
  exports: [FnfSalaryCalculationComponent]
})
export class FnfSalaryCalculationModule { }
