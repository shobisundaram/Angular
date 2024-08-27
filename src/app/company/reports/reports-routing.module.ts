import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartnerExpiryComponent } from './expiry-document/partner-expiry/partner-expiry.component';
import { VehicleExpiryComponent } from './expiry-document/vehicle-expiry/vehicle-expiry.component';
import { PartnerAttendenceComponent } from './partner-attendence/partner-attendence.component';
import { TripPaymentComponent } from './trip-payment/trip-payment.component';

const routes: Routes = [
  {
    path: "trip-payment",
    component: TripPaymentComponent,
  },
  {
    path: "partner-attendence",
    component: PartnerAttendenceComponent,
  },
  {
    path: 'partner-expiry',
    component: PartnerExpiryComponent,
  },
  {
    path: 'vehicle-expiry',
    component: VehicleExpiryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
