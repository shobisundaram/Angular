import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ElectricityService {
  private apiUrl = environment.API_ENDPOINT;
  constructor(private http: HttpClient) { }
  getData(date: any, status: any): Promise<any> {
    return this.http.get(this.apiUrl + 'tripStat?date=' + date + '&status=' + status)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  private handleData(res: any) {
    const body = res;
    return body;
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
