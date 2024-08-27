import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { NbAuthJWTToken, NbAuthService } from "@nebular/auth";
import { firstValueFrom, map, Observable, tap } from "rxjs";
import { AuthService } from "./auth.service";
import { jwtDecode } from "jwt-decode";
import { DataService } from "./admin/data.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate, CanActivateChild {
  private redirectUrl!: string;
  constructor(private authService: NbAuthService,private router: Router) {
  }

  // canActivate(    
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot):
  //   | Observable<boolean | UrlTree>
  //   | Promise<boolean | UrlTree>
  //   | boolean
  //   | UrlTree {
  //   this.redirectUrl = state.url;
  //   console.log(this.redirectUrl)
  //   const authToken = localStorage.getItem('token');
  //   console.log(authToken)
  //   // If the authToken is empty, navigate to the authentication page
  //   if (!authToken) {
  //     this.router.navigate(["auth"],{
  //       queryParams: {
  //         redirectUrl: state.url
  //      }
  //     });
  //     return false;
  //   }
  // }

  canActivate(    
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
      
    const authToken = localStorage.getItem('token');

    if (authToken) {
      try {
        // Attempt to decode the JWT token
        const decodedToken = jwtDecode(authToken);
        console.log(decodedToken);
        // Token is valid, allow access to the route
        return true;
      } catch (error) {
        // Token is invalid, redirect to the authentication page
        console.error('Invalid token:', error);
        return this.router.parseUrl('/auth'); // Redirect to the authentication page
      }
    } else {
      // Token is missing, redirect to the authentication page
      console.error('Token not found');
      return this.router.parseUrl('/auth'); // Redirect to the authentication page
    }
  }


  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot
  // ) {
  //   this.redirectUrl = state.url;
  //   console.log(this.redirectUrl)
  //   return this.authService.isAuthenticated().pipe(
  //     tap((authenticated) => {
  //       console.log("AUTH", authenticated);

  //       if (!authenticated) {
  //         this.router.navigate(["auth"],{
  //         queryParams: {
  //           redirectUrl: state.url
  //        }
  //       });
  //       }
  //     })
  //   );
  // }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return true;
  }
}
