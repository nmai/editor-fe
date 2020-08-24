import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { LoginGoogleComponent } from './login-google/login-google.component';
import { DocComponent } from './doc/doc.component';

const routes: Routes = [
  {
    path: '',
    component: LoginGoogleComponent,
    canActivateChild: [AuthGuard],
  },
  {
    path: 'doc',
    component: DocComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthService, AuthGuard],
})
export class AppRoutingModule { }
