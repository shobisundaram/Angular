import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { environment } from "../environments/environment";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // if (request.url === environment.BASEURL + "common/login/admin") {
    //   return next.handle(request);
    // }
    if (!localStorage.getItem("token")) {
      this.router.navigateByUrl("auth");
      return next.handle(request);
    }
    if (request.url === environment.BASEURL + "common/login/admin") {
      return next.handle(request);
    }
    if (localStorage.getItem("token")) {
      const copiedReq = request.clone({
        headers: request.headers
          .set("authorization", localStorage.getItem("token"))
          .set("deviceid", "Abservetech@27"),
      });
      return next.handle(copiedReq);
    }
  }
}
