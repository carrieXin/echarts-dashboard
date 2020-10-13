import { Injectable, Injector } from "@angular/core";
import {
    HttpEvent,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpInterceptor,
    HttpErrorResponse
} from "@angular/common/http";
import { Router } from "@angular/router";

import { Observable, of, throwError } from "rxjs";
import { catchError, retry, finalize } from "rxjs/operators";
import { environment } from '../../../environments/environment';

import { LoaderService } from '../../services/loader.service';

@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
    private host: string = environment.service;
    constructor(
        private router: Router,
        private injector: Injector
    ) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // 请求头配置
        let newHeaders = req.headers;
        if (localStorage.getItem('authToken') !== null) {
            const token = localStorage.getItem('authToken');
            newHeaders = newHeaders.append('auth-token', token);
        }

        const clonedReq = req.clone({
            // 补全服务器地址
            url: `${this.host}${req.url}`,
            // 设置token
            headers: newHeaders
        });

        // loading
        const loaderService = this.injector.get(LoaderService);
        loaderService.show();

        return next.handle(clonedReq)
            .pipe(
                retry(2),
                catchError((error: HttpErrorResponse) => this.handleData(error)),
                finalize(() => loaderService.hide())
            );
    }

    private handleData(event: HttpResponse<any> | HttpErrorResponse): Observable<any> {
        // 业务处理：一些通用操作
        switch (event.status) {
            case 401:
                console.log('not login');
                this.router.navigate(['/']);
                return of(event);
                break;
            default:
        }
        return throwError(event);
    }
}
