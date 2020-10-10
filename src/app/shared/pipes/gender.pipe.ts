/**
 * @author: carrie
 * @description: 性别转换
 */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gender'
})
export class GenderPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
