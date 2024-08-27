import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { VehicleExpiryComponent } from './expiry-document/vehicle-expiry/vehicle-expiry.component';
import { PartnerExpiryComponent } from './expiry-document/partner-expiry/partner-expiry.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbButtonModule, NbCardModule, NbIconModule, NbTooltipModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { PartnerAttendenceComponent } from './partner-attendence/partner-attendence.component';
import { TripPaymentComponent } from './trip-payment/trip-payment.component';


@NgModule({
  declarations: [
    TripPaymentComponent,
    PartnerAttendenceComponent,
    PartnerExpiryComponent,
    VehicleExpiryComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    Ng2SmartTableModule,
    NbCardModule,
    NbIconModule,
    TranslateModule,
    NbTooltipModule,
    NbButtonModule
  ]
})
export class ReportsModule { }
