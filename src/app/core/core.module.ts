import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// interceptor
import { httpInterceptorProviders } from './interceptors';

// guards
import { AuthGuard } from './guards/auth.guard';


@NgModule({
  imports: [
    CommonModule
  ],
  providers: [httpInterceptorProviders, AuthGuard],
  declarations: [],
  exports: []
})
export class CoreModule { }
