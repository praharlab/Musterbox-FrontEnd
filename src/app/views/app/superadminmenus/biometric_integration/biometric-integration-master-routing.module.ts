import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListBiometricIntegrationComponent } from './list-biometric-integration/list-biometric-integration.component';
import { AddBiometricIntegrationComponent } from './add-biometric-integration/add-biometric-integration.component';
import { EditBiometricIntegrationComponent } from './edit-biometric-integration/edit-biometric-integration.component';


const routes: Routes = [
  { path: '', component: ListBiometricIntegrationComponent },
  { path: 'add_biometric_integration', component: AddBiometricIntegrationComponent },
  { path: 'edit_biometric_integration', component: EditBiometricIntegrationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BiometricIntegrationMasterRoutingModule { }
