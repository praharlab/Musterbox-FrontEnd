import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListAppointmentLetterComponent } from './list-appointment-letter/list-appointment-letter.component';
import { AddAppointmentLetterComponent } from './add-appointment-letter/add-appointment-letter.component';
import { EditAppointmentLetterComponent } from './edit-appointment-letter/edit-appointment-letter.component';


const routes: Routes = [
  { path: '', component: ListAppointmentLetterComponent },
  { path: 'Add-appoinment', component: AddAppointmentLetterComponent },
  { path: 'Edit-appoinment', component: EditAppointmentLetterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentLetterMasterRoutingModule { }
