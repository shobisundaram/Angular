import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TripsRoutingModule } from './trips-routing.module';
import { AllTripsComponent } from './all-trips/all-trips.component';
import { InvoiceDetailsComponent } from './invoice-details/invoice-details.component';
import { NbActionsModule, NbButtonModule, NbCardModule, NbContextMenuModule, NbIconModule, NbTooltipModule, NbUserModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    AllTripsComponent,
    InvoiceDetailsComponent
  ],
  imports: [
    CommonModule,
    TripsRoutingModule,
    Ng2SmartTableModule,
    NbCardModule,
    NbButtonModule,
    NbActionsModule,
    NbUserModule,
    NbIconModule,
    NbContextMenuModule,
    TranslateModule,
    NbTooltipModule,
  ]
})
export class TripsModule { }
