/** Angular core */
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

/** App imports */
import { paths } from '@core/index'
import { take } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  private _translationFile: string
  private _translationsSet: any

  constructor(private http:HttpClient) {
    this._translationFile = paths.englishTranslationsPath
  }

  private getTranslationsFile(language: string): string{
    switch(language){
      case 'es':
        return paths.spanishTranslationsPath
      case 'en':
        return paths.englishTranslationsPath
      default:
        return paths.englishTranslationsPath
    }
  }

  public loadTranslationsSet(language: string){
    const translationsFile = this.getTranslationsFile(language)
    return new Promise<void>((resolve, reject) => {
      return this.http.get<{}>(translationsFile)
        .pipe(take(1))
        .subscribe({
          next: translationsObject => {
            this._translationsSet = translationsObject
            resolve()
          },
          error: err => {
            console.log(err);
            
            console.error('Error al cargar el fichero de traducciones');
            reject()
          }
        })
    })
  }

  getTranslation(word: string): string{
    return this._translationsSet[word]
  }
}
