import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'age'
})
export class AgePipe implements PipeTransform {

  transform(value: Date): any {
    let today = moment();
    let birthdate = moment(value);
    let years = today.diff(birthdate, 'years');
    birthdate.add(years, 'years');

    var months = today.diff(birthdate, 'months');
    birthdate.add(months, 'months');

    //let html:string = years + " yr ";

    //html += today.subtract(years, 'years').diff(birthdate, 'months') + " mo";

    return years + " Years and " + months+ " Months";
}


}
