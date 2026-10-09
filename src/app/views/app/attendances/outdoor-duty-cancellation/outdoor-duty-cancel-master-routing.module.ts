import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OutdoorDutyCancellationComponent } from './outdoor-duty-cancellation.component';


const routes: Routes = [
  { path: '', component: OutdoorDutyCancellationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutdoorDutyCancelMasterRoutingModule { }
