import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MySentimentsComponent } from './my-sentiments.component';


const routes: Routes = [
  { path: '', component: MySentimentsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MySentimentsMasterRoutingModule { }
