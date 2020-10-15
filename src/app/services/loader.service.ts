/**
 * ******************************************************************************************************
 * @description: 控制是否展示loading动画
 * @example: 在请求拦截器中调用
 * @author: carrie
 * ******************************************************************************************************
 */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  public showLoader = false;
  constructor() { }

  public show() {
    this.showLoader = true;
  }

  public hide() {
    this.showLoader = false;
  }

}
