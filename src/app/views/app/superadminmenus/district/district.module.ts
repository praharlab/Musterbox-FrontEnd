import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { FormsModule } from '@angular/forms';
import { ListDistrictComponent } from './list-district/list-district.component';
import { AddDistrictComponent } from './add-district/add-district.component';
import { EditDistrictComponent } from './edit-district/edit-district.component';
import { DistrictRoutingModule } from './district-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';


@NgModule({
  declarations: [ListDistrictComponent, AddDistrictComponent, EditDistrictComponent],
  imports: [
    CommonModule,
    DistrictRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    TranslateModule,
    SimpleNotificationsModule.forRoot(),
    FormsModule,
    NgSelectModule,
    TranslateModule,
    ComponentsStateButtonModule
  ]
})
export class DistrictModule { }
