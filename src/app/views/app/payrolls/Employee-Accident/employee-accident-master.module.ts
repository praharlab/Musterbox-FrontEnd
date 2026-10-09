import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeAccidentMasterRoutingModule } from './employee-accident-master-routing.module';
import { ListEmployeeAccidentComponent } from './list-employee-accident/list-employee-accident.component';
import { AddEmployeeAccidentComponent } from './add-employee-accident/add-employee-accident.component';
import { EditEmployeeAccidentComponent } from './edit-employee-accident/edit-employee-accident.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [ListEmployeeAccidentComponent, AddEmployeeAccidentComponent, EditEmployeeAccidentComponent],
  imports: [
    CommonModule,
    EmployeeAccidentMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot(),
    NgxMaterialTimepickerModule,
    CommonFilterModule
  ]
})
export class EmployeeAccidentMasterModule { }
