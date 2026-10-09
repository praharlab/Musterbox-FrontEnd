import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorComponent } from './error/error.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { environment } from 'src/environments/environment';
import { AuthGuard } from '../shared/auth.guard';
import { UserRole } from '../shared/auth.roles';
import { LoginGuard } from '../shared/login.guard';
import { DocumentsUploadComponent } from '../documents-upload/documents-upload.component';

const adminRoot = environment.adminRoot.substr(1); // path cannot start with a slash

let routes: Routes = [
  { path: 'upload-preboard-docs/:query', component: DocumentsUploadComponent },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'user',
  },
  {
    path: adminRoot,
    loadChildren: () => import('./app/app.module').then((m) => m.AppModule),
    data: { roles: [UserRole.Admin, UserRole.Editor] },
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },
  { path: 'error', component: ErrorComponent },

  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '**', redirectTo: '/error' },
  // { path: '**', redirectTo: '/user/login' },
];

if (localStorage.getItem('token')) {
  routes = [
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'user',
    },
    {
      path: adminRoot,
      loadChildren: () => import('./app/app.module').then((m) => m.AppModule),
      data: { roles: [UserRole.Admin, UserRole.Editor] },
      canActivate: [AuthGuard],
      canActivateChild: [AuthGuard],
    },
    {
      path: 'user',
      loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
    },
    { path: 'error', component: ErrorComponent },

    { path: 'unauthorized', component: UnauthorizedComponent },
    // { path: '**', redirectTo: '/error' },
    { path: '**', redirectTo: '/error' },
  ];
}

if (!environment.isAuthGuardActive) {
  routes = [
    { path: 'upload-preboard-docs/:query', component: DocumentsUploadComponent },
    // {
    //   path: '',
    //   component: HomeComponent,
    //   pathMatch: 'full',
    // },
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'user',
    },
    {
      path: 'app',
      loadChildren: () => import('./app/app.module').then((m) => m.AppModule),
    },
    {
      path: 'user',
      loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
    },
    { path: 'error', component: ErrorComponent },
    { path: '**', redirectTo: '/user/login' },
  ];
}
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewRoutingModule { }
