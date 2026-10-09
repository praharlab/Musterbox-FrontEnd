import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetMasterRoutingModule } from './asset-master-routing.module';
import { ListAssetMasterComponent } from './list-asset-master/list-asset-master.component';
import { AddAssetMasterComponent } from './add-asset-master/add-asset-master.component';
import { EditAssetMasterComponent } from './edit-asset-master/edit-asset-master.component';
import { ImportAssetMasterComponent } from './import-asset-master/import-asset-master.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [ListAssetMasterComponent, AddAssetMasterComponent, EditAssetMasterComponent, ImportAssetMasterComponent],
  imports: [
    CommonModule,
    AssetMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgSelectModule,
    FormsModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot(),
    ModalModule
  ]
})
export class AssetMasterModule { }
