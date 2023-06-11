import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'leadingZeros'
})
export class LeadingZerosPipe implements PipeTransform {

  transform(value: number, size: number): string {
    let stringIndex = value.toString()

    while(stringIndex.length < size){
      stringIndex = '0' + stringIndex
    }

    return stringIndex
  }

}
