import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LanguagesComponent } from './add-edit-language/languages.component';
import { ViewLanguageComponent } from './view-language/view-language.component';

const routes: Routes = [
  {
    path: "add-edit-language",
    component: LanguagesComponent
  },
  {
    path: "view-language",
    component: ViewLanguageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LanguageRoutingModule { }
