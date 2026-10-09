import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfflineTrackingComponent } from './offline-tracking.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';



@NgModule({
  declarations: [OfflineTrackingComponent],
  imports: [
    CommonModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    NgxUiLoaderModule,
    LayoutContainersModule
  ],
  exports: [OfflineTrackingComponent]
})
export class OfflineTrackingModule { }
