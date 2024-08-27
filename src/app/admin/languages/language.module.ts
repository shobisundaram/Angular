import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { LanguageRoutingModule } from './language-routing.module';
import { ViewLanguageComponent } from './view-language/view-language.component';
import { LanguagesComponent } from './add-edit-language/languages.component';
import { DataService } from '../data.service';
import { ApiService } from '../api.service';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbToggleModule, NbTooltipModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    LanguagesComponent,
    ViewLanguageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NbCardModule,
    NbInputModule,
    NbIconModule,
    Ng2SmartTableModule,
    ReactiveFormsModule,
    NbTooltipModule,
    TranslateModule,
    NbButtonModule,
    NbToggleModule,
    LanguageRoutingModule
  ],
  providers: [DataService, ApiService],
})
export class LanguageModule { }
