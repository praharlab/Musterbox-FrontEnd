import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OutsideTrackingComponent } from './outside-tracking.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';



@NgModule({
  declarations: [OutsideTrackingComponent],
  imports: [
    CommonModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    NgxUiLoaderModule,
    LayoutContainersModule
  ],
  exports: [OutsideTrackingComponent]
})
export class OutsideTrackingModule { }
