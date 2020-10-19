/**
 * ******************************************************************************************************
 * @description: 所有的api接口合集
 * @example: 调用接口时直接传apis对象的键名，然后在拦截器中拼接url
 * @author: carrie
 * ******************************************************************************************************
 */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApisService {

  public apis = {
    /**
     * 登录页面接口
     * ***************************************************************
     * ***************************************************************
     */
    authByCode: '/agent/auth/auth_by_verify_code',
    helpDocumentation: '/visitor/documentation/index',
    landingPageList: '/team/landing_page/list',
  };

  constructor() { }

}
