import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchMasterRoutingModule } from './branch-master-routing.module';
import { ListBranchMasterComponent } from './list-branch-master/list-branch-master.component';
import { AddBranchMasterComponent } from './add-branch-master/add-branch-master.component';
import { EditBranchMasterComponent } from './edit-branch-master/edit-branch-master.component';
import { ImportBranchMasterComponent } from './import-branch-master/import-branch-master.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';


@NgModule({
  declarations: [ ListBranchMasterComponent, AddBranchMasterComponent, EditBranchMasterComponent, ImportBranchMasterComponent],
  imports: [
    CommonModule,
    BranchMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgSelectModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    FormsModule,
    SimpleNotificationsModule.forRoot(),
    ComponentsStateButtonModule,
    TranslateModule
  ]
})
export class BranchMasterModule { }
