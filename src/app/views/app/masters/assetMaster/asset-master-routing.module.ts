import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListAssetMasterComponent } from './list-asset-master/list-asset-master.component';
import { AddAssetMasterComponent } from './add-asset-master/add-asset-master.component';
import { EditAssetMasterComponent } from './edit-asset-master/edit-asset-master.component';
import { ImportAssetMasterComponent } from './import-asset-master/import-asset-master.component';


const routes: Routes = [
  { path: '', component: ListAssetMasterComponent },
  { path: 'add_assetMaster', component: AddAssetMasterComponent },
  { path: 'edit_assetMaster', component: EditAssetMasterComponent },
  { path: 'import_assetMaster', component: ImportAssetMasterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetMasterRoutingModule { }
