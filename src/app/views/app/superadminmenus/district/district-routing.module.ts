import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListDistrictComponent } from './list-district/list-district.component';
import { AddDistrictComponent } from './add-district/add-district.component';
import { EditDistrictComponent } from './edit-district/edit-district.component';

const routes: Routes = [
  { path: '', component: ListDistrictComponent },
  { path: 'add_district', component: AddDistrictComponent },
  { path: 'edit_district', component: EditDistrictComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DistrictRoutingModule { }
