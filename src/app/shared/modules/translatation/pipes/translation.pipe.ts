
import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '@shared/index';

@Pipe({
  name: 'translate'
})
export class TranslationPipe implements PipeTransform {

  constructor(private translationService: TranslationService){

  }

  transform(value: string): string {
    return this.translationService.getTranslation(value) ? this.translationService.getTranslation(value) : ''
  }

}
