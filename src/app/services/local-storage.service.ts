import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private source = window.localStorage;

  constructor() {
    this.init();
  }

  /**
   * 初始化判断存储的对象是否已过期，过期则删除
   */
  private init() {
    const reg = new RegExp("_expires");
    const source = this.source;
    const list = Object.keys(source);
    if (list.length > 0) {
      list.map((key) => {
        if (!reg.test(key)) {
          const now = Date.now();
          const expires = source[`${key}_expires`] || Date.now() + 1;
          if (now >= expires) {
            this.removeItem(key);
          }
        }
        return key;
      });
    }
  }

  /**
   * 添加存储对象, 可设置过期时间
   * @param key 键名
   * @param value 键值
   * @param expired 过期时间，单位为分钟
   */
  public setItem(key: string, value: any, expired?: number) {
    const source = this.source;
    // source[key] = typeof value === 'object' ? JSON.stringify(value) : value;
    source[key] = JSON.stringify(value);
    if (expired) {
      source[`${key}_expires`] = Date.now() + 1000 * 60 * expired;
    }
  }

  /**
   * 获取存储对象
   * @description: 返回值之前判断是否存在过期时间，如果当前时间大于过期时间，则删除该项
   * @param key 键名
   */
  public getItem(key: string) {
    const source = this.source;
    const expired = source[`${key}_expires`] || Date.now() + 1;
    const now = Date.now();
    if (now >= expired) {
      this.removeItem(key);
      return;
    }
    const value = source[key] ? JSON.parse(source[key]) : source[key];
    return value;
  }

  /**
   * 删除对象
   * @param key 键名
   */
  public removeItem(key: string) {
    const source = this.source;
    const value = source[key];
    delete source[key];
    delete source[`${key}_expires`];
    return value;
  }

}
