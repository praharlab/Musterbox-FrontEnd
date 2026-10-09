import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListMeetingPlaceComponent } from './list-meeting-place/list-meeting-place.component';
import { AddMeetingPlaceComponent } from './add-meeting-place/add-meeting-place.component';
import { EditMeetingPlaceComponent } from './edit-meeting-place/edit-meeting-place.component';
import { ImportMeetingPlaceComponent } from './import-meeting-place/import-meeting-place.component';


const routes: Routes = [
  { path: '', component: ListMeetingPlaceComponent },
  { path: 'add_meetingPlace', component: AddMeetingPlaceComponent },
  { path: 'edit_meetingPlace', component: EditMeetingPlaceComponent },
  { path: 'import_meetingPlace', component: ImportMeetingPlaceComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeetingPlaceMasterRoutingModule { }
