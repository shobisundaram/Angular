import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettlementRoutingModule } from './settlement-routing.module';
import { NbButtonModule, NbCardModule, NbDatepickerModule, NbIconModule, NbInputModule, NbToggleModule, NbTooltipModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { TranslateModule } from '@ngx-translate/core';
import { PartnerSettlementComponent } from './partner-settlement/partner-settlement.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    PartnerSettlementComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NbCardModule,
    NbInputModule,
    NbIconModule,
    Ng2SmartTableModule,
    ReactiveFormsModule,
    NbDatepickerModule,
    NbTooltipModule,
    TranslateModule,
    NbButtonModule,
    NbToggleModule,
    NgSelectModule,
    SettlementRoutingModule
  ]
})
export class SettlementModule { }
