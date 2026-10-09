import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListOfferletterComponent } from './list-offerletter/list-offerletter.component';
import { AddOfferletterComponent } from './add-offerletter/add-offerletter.component';
import { EditOfferletterComponent } from './edit-offerletter/edit-offerletter.component';


const routes: Routes = [
  { path: '', component: ListOfferletterComponent },
  { path: 'Add-Offer-Letter', component: AddOfferletterComponent },
  { path: 'Edit-Offer-Letter', component: EditOfferletterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfferLetterMasterRoutingModule { }
