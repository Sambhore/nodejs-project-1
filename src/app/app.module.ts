import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './pages/header/header.component';
import { FooterComponent } from './pages/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApiCallHomeComponent } from './pages/api-call-home/api-call-home.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';

import { DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewPageComponent } from './pages/view-page/view-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RemoveSpacesPipe } from './pipes/remove-spaces.pipe';
import { ToNumberPipe } from './pipes/to-number.pipe';
import { NotApplicablePipe } from './pipes/not-applicable.pipe';
import { AgePipe } from './pipes/age.pipe';
import { LoginComponent } from './pages/login/login.component';
import { ErrorComponent } from './pages/error/error.component';
import { AccessTokenInterceptor } from './interceptors/access-token.interceptor';
import { CredGptPageComponent } from './pages/cred-gpt-page/cred-gpt-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ApiCallHomeComponent,
    ViewPageComponent,
    DashboardPageComponent,
    RemoveSpacesPipe,
    ToNumberPipe,
    NotApplicablePipe,
    AgePipe,
    LoginComponent,
    ErrorComponent,
    CredGptPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatExpansionModule,
    MatCardModule,
    MatCheckboxModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatChipsModule
  ],
  providers: [
    DatePipe,
    CurrencyPipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AccessTokenInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
