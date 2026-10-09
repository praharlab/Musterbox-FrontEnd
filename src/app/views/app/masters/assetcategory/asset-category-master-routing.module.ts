import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListAssetcategoryComponent } from './list-assetcategory/list-assetcategory.component';
import { AddAssetcategoryComponent } from './add-assetcategory/add-assetcategory.component';
import { EditAssetcategoryComponent } from './edit-assetcategory/edit-assetcategory.component';
import { ImportAssetCategoryComponent } from './import-asset-category/import-asset-category.component';


const routes: Routes = [
  { path: '', component: ListAssetcategoryComponent },
  { path: 'add_asset_category', component: AddAssetcategoryComponent },
  { path: 'edit_asset_category', component: EditAssetcategoryComponent },
  { path: 'import_asset_category', component: ImportAssetCategoryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetCategoryMasterRoutingModule { }
