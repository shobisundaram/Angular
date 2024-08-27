import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { LanguageSettings } from '../../environments/environment';

export class CustomTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient, private prefix: string, private suffix: string) {}

  public getTranslation(lang: string): Observable<any> {
    const serverUrl = `${this.prefix}/${lang}${this.suffix}`;
    const localUrl = `/assets/i18n/${LanguageSettings.defaultSelectedLang}.json`;
    const serverTimeout = 2000; // milliseconds
    return this.http.get(serverUrl).pipe(
      catchError(() => {
        console.log("========================>")
        return this.http.get(localUrl).pipe(
          catchError(() => {
            console.error(`Could not load translation file: ${localUrl}`);
            return of({});
          })
        );
      })
    );
  }
}
