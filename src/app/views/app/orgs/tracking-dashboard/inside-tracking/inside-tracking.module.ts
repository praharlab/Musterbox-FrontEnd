import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { InsideTrackingComponent } from './inside-tracking.component';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';



@NgModule({
  declarations: [InsideTrackingComponent],
  imports: [
    CommonModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    NgxUiLoaderModule,
    LayoutContainersModule
  ],
  exports: [InsideTrackingComponent]
})
export class InsideTrackingModule { }
