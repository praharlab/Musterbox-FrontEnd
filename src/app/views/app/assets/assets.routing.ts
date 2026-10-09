import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetsComponent } from './assets.component';
import { AssetMasterComponent } from './asset-master/asset-master.component';

const routes: Routes = [
  {
    path: '',
    component: AssetsComponent,
    children: [
      { path: '', redirectTo: 'asset_master', pathMatch: 'full' },

      { path: 'asset_master', component: AssetMasterComponent },

      { path: 'myasset', loadChildren: () => import('./myasset/myasset-master.module').then((m) => m.MyassetMasterModule) },

      { path: 'assetassigntoemp', loadChildren: () => import('./asignassettoemp/assign-asset-to-emp-master.module').then((m) => m.AssignAssetToEmpMasterModule) },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssetsRoutingModule { }
