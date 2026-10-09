import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListWeekOffShuffleComponent } from './list-week-off-shuffle/list-week-off-shuffle.component';
import { AddWeekOffShuffleComponent } from './add-week-off-shuffle/add-week-off-shuffle.component';
import { EditWeekOffShuffleComponent } from './edit-week-off-shuffle/edit-week-off-shuffle.component';


const routes: Routes = [
  { path: '', component: ListWeekOffShuffleComponent },
  { path: 'add_weekoff_shuffle', component: AddWeekOffShuffleComponent },
  { path: 'edit_weekoff_shuffle', component: EditWeekOffShuffleComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WeekOffShuffleMasterRoutingModule { }
