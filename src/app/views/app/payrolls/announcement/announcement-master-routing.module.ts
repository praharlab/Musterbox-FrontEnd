import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListAnnouncementComponent } from './list-announcement/list-announcement.component';
import { AddAnnouncementComponent } from './add-announcement/add-announcement.component';
import { EditAnnouncementComponent } from './edit-announcement/edit-announcement.component';


const routes: Routes = [
  { path: '', component: ListAnnouncementComponent },
  { path: 'add_announcement', component: AddAnnouncementComponent },
  { path: 'edit_announcement', component: EditAnnouncementComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnnouncementMasterRoutingModule { }
