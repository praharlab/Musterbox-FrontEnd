import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeNdaMasterRoutingModule } from './employee-nda-master-routing.module';
import { ListEmployeeNdaComponent } from './list-employee-nda/list-employee-nda.component';
import { AddEmployeeNdaComponent } from './add-employee-nda/add-employee-nda.component';
import { EditEmployeeNdaComponent } from './edit-employee-nda/edit-employee-nda.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [ListEmployeeNdaComponent, AddEmployeeNdaComponent, EditEmployeeNdaComponent],
  imports: [
    CommonModule,
    EmployeeNdaMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgSelectModule,
    FormsModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class EmployeeNdaMasterModule { }
