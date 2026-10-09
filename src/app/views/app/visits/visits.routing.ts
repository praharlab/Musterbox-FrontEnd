import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisitsComponent } from './visits.component';
import { VisitmasterComponent } from './visitmaster/visitmaster.component';
import { NextvisitscheduleComponent } from './nextvisitschedule/nextvisitschedule.component';
import { AddVisitCallFollowupComponent } from './visitcallfollowup/add-visit-call-followup/add-visit-call-followup.component';
import { EditVisitCallFollowupComponent } from './visitcallfollowup/edit-visit-call-followup/edit-visit-call-followup.component';
import { ListVisitCallFollowupComponent } from './visitcallfollowup/list-visit-call-followup/list-visit-call-followup.component';

const routes: Routes = [
  {
    path: '',
    component: VisitsComponent,
    children: [
      { path: '', redirectTo: 'visit_master', pathMatch: 'full' },
      { path: 'visit_master', component: VisitmasterComponent },

      { path: 'myteamvisit', loadChildren: () => import('./my-team-visit/team-visit-master.module').then((m) => m.TeamVisitMasterModule) },

      { path: 'visit', loadChildren: () => import('./visit/visit-master.module').then((m) => m.VisitMasterModule) },

      { path: 'tour', loadChildren: () => import('./tour/tour-master.module').then((m) => m.TourMasterModule) },

      { path: 'admin-tour', loadChildren: () => import('./admin-tour/admin-tour-master.module').then((m) => m.AdminTourMasterModule) },

      { path: 'vehicle_meter_details', loadChildren: () => import('./daily-vehicle-usage-report/daily-vehicle-usage-report-master.module').then((m) => m.DailyVehicleUsageReportMasterModule) },

      { path: 'callfollowup', loadChildren: () => import('./callfollowup/call-followup-master.module').then((m) => m.CallFollowupMasterModule) },

      { path: 'nextvisitschedule/:id', component: NextvisitscheduleComponent },

      {
        path: 'visitcallfollowup',
        component: AddVisitCallFollowupComponent,
      },
      {
        path: 'listvisitcallfollowup',
        component: ListVisitCallFollowupComponent,
      },
      {
        path: 'editvisitcallfollowup',
        component: EditVisitCallFollowupComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisitsRoutingModule { }
