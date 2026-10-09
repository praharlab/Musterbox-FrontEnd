import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpsOffTrackingComponent } from './gps-off-tracking.component';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';



@NgModule({
  declarations: [GpsOffTrackingComponent],
  imports: [
    CommonModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    NgxUiLoaderModule,
    LayoutContainersModule
  ],
  exports: [GpsOffTrackingComponent]
})
export class GpsOffTrackingModule { }
