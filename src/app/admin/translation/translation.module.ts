import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslationRoutingModule } from './translation-routing.module';
import { TranslationComponent } from './add-edit-translation/translation.component';
import { ViewTranslationComponent } from './view-translation/view-translation.component';
import { ApiService } from '../api.service';
import { DataService } from '../data.service';
import { TranslateModule } from '@ngx-translate/core';
import { NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbTooltipModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TranslationComponent,
    ViewTranslationComponent
  ],
  imports: [
    CommonModule,
    NbCardModule,
    NbInputModule,
    NbButtonModule,
    FormsModule,
    ReactiveFormsModule,
    NbIconModule,
    NbTooltipModule,
    TranslateModule,
    Ng2SmartTableModule,
    TranslationRoutingModule
  ],
  providers: [DataService, ApiService],
})
export class TranslationModule { }
