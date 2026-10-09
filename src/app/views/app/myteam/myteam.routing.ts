import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyteamComponent } from './myteam.component';
import { MyteammasterComponent } from './myteammaster/myteammaster.component';
import { CompanyStructureComponent } from './company-structure/company-structure.component';

const routes: Routes = [
  {
    path: '',
    component: MyteamComponent,
    children: [
      { path: '', redirectTo: 'myteam_master', pathMatch: 'full' },
      { path: 'myteam_master', component: MyteammasterComponent },
      
      { path: 'user_tracking', loadChildren: () => import('./user-tracking/user-tracking-master.module').then((m) => m.UserTrackingMasterModule) },

      { path: 'structure', component: CompanyStructureComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyTeamRoutingModule {}
