import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ReportsRoutingModule } from "./reports-routing.module";
import { TripPaymentComponent } from "./trip-payment/trip-payment.component";
import { PartnerAttendenceComponent } from "./partner-attendence/partner-attendence.component";
import {
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbTooltipModule,
} from "@nebular/theme";
import { TranslateModule } from "@ngx-translate/core";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { DataService } from "../data.service";
import { PartnerExpiryComponent } from "./expiry-document/partner-expiry/partner-expiry.component";
import { VehicleExpiryComponent } from "./expiry-document/vehicle-expiry/vehicle-expiry.component";
import { ReviewsComponent } from './reviews/reviews.component';
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    TripPaymentComponent, 
    PartnerAttendenceComponent, 
    PartnerExpiryComponent,
    VehicleExpiryComponent,
    ReviewsComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    NbTooltipModule,
    NbCardModule,
    TranslateModule,
    NbIconModule,
    NgSelectModule,
    FormsModule,
    Ng2SmartTableModule,
    NbButtonModule,
  ],
  providers: [DataService],
})
export class ReportsModule { }
