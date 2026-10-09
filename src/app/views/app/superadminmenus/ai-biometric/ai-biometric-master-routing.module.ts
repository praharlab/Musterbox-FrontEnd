import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AiBiometricComponent } from './ai-biometric.component';
import { AddAiBiometricComponent } from './add-ai-biometric/add-ai-biometric.component';
import { EditAiBiometricComponent } from './edit-ai-biometric/edit-ai-biometric.component';


const routes: Routes = [
  { path: '', component: AiBiometricComponent },
  { path: 'add_ai_biometric', component: AddAiBiometricComponent },
  { path: 'edit_ai_biometric', component: EditAiBiometricComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AiBiometricMasterRoutingModule { }
