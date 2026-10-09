import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListSiteComponent } from './list-site/list-site.component';
import { AddSiteComponent } from './add-site/add-site.component';
import { EditSiteComponent } from './edit-site/edit-site.component';


const routes: Routes = [
  { path: '', component: ListSiteComponent },
  { path: 'addSite', component: AddSiteComponent },
  { path: 'editSite', component: EditSiteComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SiteMasterRoutingModule { }
