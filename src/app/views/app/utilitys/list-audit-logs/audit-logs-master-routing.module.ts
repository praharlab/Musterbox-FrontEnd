import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListAuditLogsComponent } from './list-audit-logs.component';


const routes: Routes = [
  { path: '', component: ListAuditLogsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuditLogsMasterRoutingModule { }
