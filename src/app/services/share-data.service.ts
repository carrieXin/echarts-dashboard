/**
 * ******************************************************************************************************
 * @description: 存储一些公用的数据
 * @example: 比如导航栏菜单数据、某些固定的下拉列表数据，最好不要在这里做格式硬处理
 * @author: carrie
 * ******************************************************************************************************
 */
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {
  // 当前登录用户信息
  public userInfo = new BehaviorSubject<object>(null);

  constructor() { }

}
