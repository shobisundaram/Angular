import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslationComponent } from './add-edit-translation/translation.component';
import { ViewTranslationComponent } from './view-translation/view-translation.component';

const routes: Routes = [
  {
    path: "add-edit-translation",
    component: TranslationComponent
  },
  {
    path: "view-translation",
    component: ViewTranslationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TranslationRoutingModule { }
