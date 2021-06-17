/**
 * ******************************************************************************************************
 * @description: 单位转换
 * @param: thousand  单位转为千
 * @example:
 * 单位转为万:
 * <div>{{count | convertUnit}}</div>
 * 单位转为千:
 * <div>{{{count | convertUnit: 'thousand'}}</div>
 *
 * ******************************************************************************************************
 */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertUnit'
})
export class ConvertUnitPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let res;
    if (value) {
      switch (args) {
        case 'thousand':
          res = Number((Number(value) / 1000).toFixed(2));
          break;
        default:
          res = Number((Number(value) / 10000).toFixed(2));
      }
    } else {
      res = 0;
    }

    return res;
  }

}
