import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toNumber'
})
export class ToNumberPipe implements PipeTransform {

  transform(value: any):any {
    let num = Number(value);
    return isNaN(num) || null ? 0 : num;
  }

}
