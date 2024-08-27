import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { CommonData, LanguageSettings } from "../../../../environments/environment";
import { ApiService } from "../../../admin/api.service";
import { CompanyapiService } from "../../../company/companyapi.service";

@Component({
  selector: "ngx-footer",
  styleUrls: ["./footer.component.scss"],
  template: `
    <div class="d-flex justify-content-end align-items-center">
        <div>
          <nb-select placeholder="{{ 'COMMON.SELECTLANGUAGE' | translate }}"  [(selected)]="selectedLang">
              <nb-option *ngFor="let option of languages" (click)="changeLang(option.indexName)" [value]="option.indexName">{{option.name}}
              </nb-option>
          </nb-select>
        </div>
        &nbsp;
        <span class="created-by float-right">
          Created by
          <b><a href="https://www.abservetech.com/" target="_blank">Abservetech</a></b>
        </span>
    </div>
  `,
})
export class FooterComponent {
  // languages = CommonData.defaultLanguage;
  selectedLang: string;
  languages: any;
  constructor(
    private apiservice: ApiService,
    private companyapiservice: CompanyapiService,
    public translate: TranslateService) {
    translate.addLangs(LanguageSettings.languages);
    this.language()
    this.selectedLang =  sessionStorage.getItem('language') || LanguageSettings.defaultSelectedLang;
    translate.setDefaultLang(this.selectedLang);
  }
  changeLang(lang: string): void {
    console.log(lang)
    sessionStorage.setItem('language',lang)
    this.translate.use(lang);
    window.location.reload()
    // Optionally, you can do other actions upon language change here
  }
  language(){
    this.apiservice.CommonGetApi('module/translation/language')
    .subscribe({
      next: (res) => {
        console.log(res.data.language.length)
        if(res.data.language.length > 0){
          this.languages =  res.data.language
        }else{
          this.languages = CommonData.defaultLanguage;
        }
      }
    })
  }

}
