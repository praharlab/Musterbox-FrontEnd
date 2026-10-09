import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminTourComponent } from './admin-tour.component';


const routes: Routes = [
  { path: '', component: AdminTourComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminTourMasterRoutingModule { }
