import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { DefaultInterceptor } from './default.interceptor';
import { ErrorInterceptor } from './error.interceptor';

export const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true }
];
