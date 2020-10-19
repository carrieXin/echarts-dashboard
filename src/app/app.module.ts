import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// components

// modules
import { SharedModule } from './shared/shared.module';
import { LayoutModule } from './layout/layout.module';

// interceptor
import { httpInterceptorProviders } from './core/interceptors';

// guards
import { AuthGuard } from './core/guards/auth.guard';

const components = [
  AppComponent,
];

@NgModule({
  declarations: [
    ...components
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    LayoutModule
  ],
  providers: [httpInterceptorProviders, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
