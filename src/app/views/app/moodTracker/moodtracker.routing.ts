import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MoodTrackerComponent } from './moodtracker.component';
import { MoodTrackerMasterComponent } from './mood-tracker-master/mood-tracker-master.component';

const routes: Routes = [
  {
    path: '',
    component: MoodTrackerComponent,
    children: [
      { path: '', redirectTo: 'moodTracker_master', pathMatch: 'full' },

      { path: 'moodTracker_master', component: MoodTrackerMasterComponent },
      
      { path: 'sentimentsReport', loadChildren: () => import('./sentiments-report/sentiments-report-master.module').then((m) => m.SentimentsReportMasterModule) },

      { path: 'sentimentsAnalysisDashboard', loadChildren: () => import('./sentiment-analysis-dashboard/sentiment-analysis-dashboard-master.module').then((m) => m.SentimentAnalysisDashboardMasterModule) },
      
      { path: 'mysentiments', loadChildren: () => import('./my-sentiments/my-sentiments-master.module').then((m) => m.MySentimentsMasterModule) },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoodTrackerRoutingModule {}
