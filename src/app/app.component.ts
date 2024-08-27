/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from "@angular/core";
import { LanguageSettings } from "../environments/environment";
import { TranslateService } from "@ngx-translate/core";
import { NavigationEnd, Router } from "@angular/router";
import { Subscription, debounceTime, filter, map } from "rxjs";
import { AuthService } from "./auth.service";

@Component({
  selector: "ngx-app",
  template: "<router-outlet></router-outlet>",
})
export class AppComponent implements OnInit {
  private routerSubscription: Subscription;
  constructor(public translate: TranslateService,
    private router: Router,
    private authService: AuthService,) {
      let language =  sessionStorage.getItem('language') || LanguageSettings.defaultSelectedLang;
      translate.setDefaultLang(language);
      this.translate.use(language);
      translate.addLangs(LanguageSettings.languages);
  }

  ngOnInit(): void {
    this.routerSubscription = this.router.events
    .pipe(
      filter((event) => event instanceof NavigationEnd),
      map(()=>{

        const urlList = this.router.url.split('/');
        const lastUrlSegment = urlList[urlList.length - 1];
        console.log(lastUrlSegment)
        if(lastUrlSegment.startsWith('auth') ){
          this.router.navigate(['/admin/dashboard']);
          return '';
        }else if(lastUrlSegment == 'company-login'){
          this.router.navigate(['/company/dashboard']);
        }
        // if(lastUrlSegment == 'auth' || lastUrlSegment == 'login'){
        //   this.authService.setLoginInfo(null)
        // }
        return urlList[urlList.length - 1];
      })
    )
    .subscribe((title) => {
      console.log(title)
    })
  }
  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
