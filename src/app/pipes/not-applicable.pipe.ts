import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'NA'
})
export class NotApplicablePipe implements PipeTransform {

  transform(value: string): string {
    let newStr: string = "";
    if(value == ''){
        newStr="NA";
    } else {
        newStr = value;
    }
    return newStr;
  }

}
