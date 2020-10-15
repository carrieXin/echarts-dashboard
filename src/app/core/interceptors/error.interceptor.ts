import { Injectable } from "@angular/core";
import {
    HttpEvent,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpInterceptor,
    HttpErrorResponse,
    HttpEventType
} from "@angular/common/http";
import { Router } from "@angular/router";

import { Observable, of, throwError } from "rxjs";
import { catchError, tap, mergeMap } from "rxjs/operators";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private router: Router
    ) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
            .pipe(
                catchError((error: HttpErrorResponse) => this.serverErrorHandle(error)),
                tap(
                    (event: HttpResponse<any>) => {
                        if (event instanceof HttpResponse) {
                            const errCode = event.body.error_code;
                            if (errCode !== 0) {
                                this.clientErrorHandle(event);
                            }
                        }

                    }
                )
            );
    }

    /**
     * 服务端请求错误处理
     */
    private serverErrorHandle(event: HttpResponse<any> | HttpErrorResponse): Observable<any> {
        // 业务处理：一些通用操作
        switch (event.status) {
            case 200:
                if (event instanceof HttpResponse) {
                    const body = event.body;
                    if (body && body['error_code'] !== 0) {

                    }
                }
                break;
            case 401:
                console.log('not login');
                this.router.navigate(['/']);
                return of(event);
                break;
            default:
        }
        return throwError(event);
    }

    /**
     * 客户端请求错误处理
     */
    private clientErrorHandle(event: HttpResponse<any> | HttpErrorResponse): Observable<any> {
        let errMsg;
        const errCode = event['body']['error_code'];
        const errorList = {
            2000: '用于请求鉴权凭证的数据错误',
            2100: '您的登录授权无效，请重新登录',
            2101: '未找到鉴权凭证, 但访问此API需要鉴权凭证',
            2102: '鉴权凭证被篡改导致签名失效',
            2103: '鉴权凭证过期',
        };
        errMsg = errorList[errCode];
        throw (errMsg);
    }
}
