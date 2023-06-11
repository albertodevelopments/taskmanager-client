import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core'
import { paths } from '@core/index';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarTranslationService {

  private _translationFile: string

  constructor(
    private http: HttpClient
  ) { 
    this._translationFile = paths.englishCalendarTranslationsPath
  }

  private getTranslationsFile(language: string): string{
    switch(language){
      case 'es':
        return paths.spanishCalendarTranslationsPath
      case 'en':
        return paths.englishCalendarTranslationsPath
      default:
        return paths.englishCalendarTranslationsPath
    }
  }

  changeLanguage(language: string){
    this._translationFile = this.getTranslationsFile(language)      
  }

  public translate(): Observable<any>{
    return this.http.get<any>(this._translationFile)
  }
}
