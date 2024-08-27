import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyapiService {

  constructor(private http: HttpClient) { }

  CommonGetApi(path: string): Observable<any> {
    return this.http.get<any>(environment.API_ENDPOINT + path);
  }
  CommonGetApiwithparams(path: string, params: any): Observable<any> {
    return this.http.get<any>(environment.API_ENDPOINT + path, { params: params });
  }
  CommonPostApi(inputs: any, path: string): Observable<any> {
    return this.http.post<any>(environment.API_ENDPOINT + path, inputs);
  }
  CommonPostOneApiwithParams(path: string, id: string): Observable<any> {
    return this.http.post<any>(
      environment.API_ENDPOINT + path + "" + `?id=` + id,
      {}
    );
  }
  CommonLoginPostApi(inputs: any, path: string): Observable<any> {
    const headers = new HttpHeaders().set("deviceid", "Abservetech@27");
    return this.http.post<any>(environment.API_ENDPOINT + path, inputs, {
      headers: headers,
    });
  }

  CommonPatchApi(inputs: any, path: string): Observable<any> {
    return this.http.patch<any>(environment.API_ENDPOINT + path, inputs);
  }

  CommonPutApi(path: string, inputs: any): Observable<any> {
    return this.http.put<any>(environment.API_ENDPOINT + path, inputs);
  }

  CommonDeleteApi(id: any, path: string): Observable<any> {
    return this.http.delete<any>(environment.API_ENDPOINT + path + "/" + id);
  }
  EmailVerificationGetApi(data: string, path: string): Observable<any> {
    return this.http.get<any>(
      environment.API_ENDPOINT + path + "/" + "exists?email=" + data
    );
  }

  PhoneVerificationGetApi(
    phone: string,
    phoneCode: string,
    path: string
  ): Observable<any> {
    return this.http.get<any>(
      environment.API_ENDPOINT +
        path +
        "/" +
        "exists?phone=" +
        phone +
        "&phoneCode=" +
        phoneCode
    );
  }

  openStreetmapGetApi(city: string): Observable<any> {
    return this.http.get<any>(
      "https://nominatim.openstreetmap.org/search.php?q=" +
        city +
        "&polygon_geojson=1&format=json"
    );
  }

  downloadExcelFile(api: string, fileName: string): void {
    this.http
      .get(environment.API_ENDPOINT + api, {
        observe: "response",
        responseType: "blob",
      })
      .subscribe((response) => {
        console.log(
          "All Headers:",
          response.headers.keys(),
          response.headers.get("X-Filename")
        );
        const blob = response.body;
        console.log("BLOB", blob);

        // Extract filename from Content-Disposition header
        const contentDispositionHeader = response.headers.get(
          "Content-Disposition"
        );
        // debugger;
        let filename = fileName; // Default filename
        const filenameHeader = response.headers.get("x-filename");
        if (filenameHeader) {
          filename = filenameHeader;
        }
        // if (contentDispositionHeader) {
        //   const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        //   const matches = filenameRegex.exec(contentDispositionHeader);
        //   if (matches != null && matches[1]) {
        //     filename = matches[1].replace(/['"]/g, "");
        //   }
        // }

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      });
  }
}
