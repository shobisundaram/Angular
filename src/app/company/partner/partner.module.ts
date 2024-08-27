import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartnerRoutingModule } from './partner-routing.module';
import { ViewPartnerComponent } from './view-partner/view-partner.component';
import { AddPartnerComponent } from './add-partner/add-partner.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbAccordionModule, NbActionsModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbContextMenuModule, NbDatepickerModule, NbIconModule, NbInputModule, NbRadioModule, NbSelectModule, NbTabsetModule, NbTooltipModule, NbUserModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { CompanyModule } from '../company.module';


@NgModule({
  declarations: [
    ViewPartnerComponent,
    AddPartnerComponent
  ],
  imports: [
    CommonModule,
    PartnerRoutingModule,
    Ng2SmartTableModule,
    NbCardModule,
    ReactiveFormsModule,
    NbInputModule,
    NbButtonModule,
    NbActionsModule,
    NbUserModule,
    NbCheckboxModule,
    NbRadioModule,
    NbDatepickerModule,
    NbSelectModule,
    NbIconModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NbContextMenuModule,
    NbTabsetModule,
    NbAccordionModule,
    CompanyModule,
    NbTooltipModule,
  ]
})
export class PartnerModule { }
