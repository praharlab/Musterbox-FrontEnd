import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetCategoryMasterRoutingModule } from './asset-category-master-routing.module';
import { ListAssetcategoryComponent } from './list-assetcategory/list-assetcategory.component';
import { AddAssetcategoryComponent } from './add-assetcategory/add-assetcategory.component';
import { EditAssetcategoryComponent } from './edit-assetcategory/edit-assetcategory.component';
import { ImportAssetCategoryComponent } from './import-asset-category/import-asset-category.component';
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
  declarations: [ListAssetcategoryComponent, AddAssetcategoryComponent, EditAssetcategoryComponent, ImportAssetCategoryComponent],
  imports: [
    CommonModule,
    AssetCategoryMasterRoutingModule,
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
export class AssetCategoryMasterModule { }
