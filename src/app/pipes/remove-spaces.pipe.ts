import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeSpaces'
})
export class RemoveSpacesPipe implements PipeTransform {

  // transform(value: unknown, ...args: unknown[]): unknown {
  //   return null;
  // }
  transform(value: any): any {
    if (value === undefined)
      return 'undefined';
    return value.replace(/\s/g, "");
  }
}
