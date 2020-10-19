import { Injectable, Injector } from "@angular/core";
import {
    HttpEvent,
    HttpRequest,
    HttpResponse,
    HttpErrorResponse,
    HttpHandler,
    HttpInterceptor,
    HttpEventType
} from "@angular/common/http";
import { Router } from "@angular/router";

import { Observable, of, throwError } from "rxjs";
import { retry, finalize, map, catchError } from "rxjs/operators";
import { environment } from '../../../environments/environment';

// services
import { LoaderService } from '../../services/loader.service';
import { ApisService } from '../../services/apis.service';
import { LocalStorageService } from '../../services/local-storage.service';

@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
    private host: string = environment.service;
    constructor(
        private injector: Injector,
        private router: Router,
        private localService: LocalStorageService,
        private apisService: ApisService,
        private loaderService: LoaderService
    ) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // loading
        this.loaderService.show();

        // 请求头配置
        let newHeaders = req.headers;
        // 不需要token的接口
        const withoutTokenApis = ['helpDocumentation'];
        const token = this.localService.getItem('authToken');
        if (token && !withoutTokenApis.includes(req.url)) {
            newHeaders = newHeaders.append('auth-token', token);
        }

        const clonedReq = req.clone({
            // 补全服务器地址
            url: `${this.host}${this.apisService.apis[req.url]}`,
            // 设置token
            headers: newHeaders
        });
        return next.handle(clonedReq)
            .pipe(
                retry(2),
                catchError((error: HttpErrorResponse) => this.serverErrorHandle(error)),
                finalize(() => this.loaderService.hide()),
                map((event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                        // 有进度条的请求
                        if (req.reportProgress) {
                            this.getEventMessage(event);
                        }

                        // 客户端请求错误处理
                        const errCode = event.body.error_code;
                        if (errCode !== 0) {
                            this.clientErrorHandle(event);
                        }

                        // 统一处理返回数据的格式
                        return event.clone({ body: event.body['data'] });
                    }
                })
            );
    }

    /**
     * 文件上传进度条
     */
    private getEventMessage(event: HttpEvent<any>) {
        const res = event['body']['data'];
        switch (event.type) {
            case HttpEventType.Sent:
                res['progress_bar'] = {
                    txt: '开始上传',
                    val: 0
                };
                break;
            case HttpEventType.UploadProgress:
                res['progress_bar'] = {
                    txt: '上传中',
                    val: Math.round(100 * event.loaded / event.total)
                };
                break;
            case HttpEventType.Response:
                const errCode = event.body['error_code'];
                // 当errorCode为0时才是成功
                if (Number(errCode) === 0) {
                    res['progress_bar'] = {
                        txt: '完成上传',
                        val: 100
                    };
                    return res;
                } else {

                }
                break;
        }
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
                        this.clientErrorHandle(event);
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
        throw(errMsg);
    }
}
