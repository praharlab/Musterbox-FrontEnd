import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssignAssetToEmpMasterRoutingModule } from './assign-asset-to-emp-master-routing.module';
import { AsignassettoempComponent } from './asignassettoemp.component';
import { AddAssignAssetComponent } from './add-assign-asset/add-assign-asset.component';
import { EditAssignAssetComponent } from './edit-assign-asset/edit-assign-asset.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [AsignassettoempComponent, AddAssignAssetComponent, EditAssignAssetComponent],
  imports: [
    CommonModule,
    AssignAssetToEmpMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class AssignAssetToEmpMasterModule { }
