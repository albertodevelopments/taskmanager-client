import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parseTime'
})
export class ParseTimePipe implements PipeTransform {

  transform(timeInHours: number): string {
    let parsedTime: string = ''

    
    return parsedTime
  }

}
