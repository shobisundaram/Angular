import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HeaderComponentsService {

  constructor(private http: HttpClient) { }
  CommonGetApi(path: string): Observable<any> {
    return this.http.get<any>(environment.API_ENDPOINT + path);
  }
}
