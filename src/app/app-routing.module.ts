import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApiCallHomeComponent } from './pages/api-call-home/api-call-home.component';
import { ViewPageComponent } from './pages/view-page/view-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { LoginComponent } from './pages/login/login.component';
import { ErrorComponent } from './pages/error/error.component';

import { AuthGuard } from './services/auth.guard';
import { CredGptPageComponent } from './pages/cred-gpt-page/cred-gpt-page.component';

const routes: Routes = [
  // {path:'oldview',component:ApiCallHomeComponent},
  {path:'trigger-services',component:ViewPageComponent, canActivate: [AuthGuard]},
  {path:'cred-gpt',component:CredGptPageComponent, canActivate: [AuthGuard]},
  {path:'dashboard',component:DashboardPageComponent},
  {path:'',component:LoginComponent},
  {path:'callback',component:LoginComponent},
  {path:'error',component:ErrorComponent},
  {path:'*',component:ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
