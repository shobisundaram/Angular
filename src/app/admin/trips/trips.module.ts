import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { TripsRoutingModule } from "./trips-routing.module";
import { AllTripsComponent } from "./all-trips/all-trips.component";
import { Ng2SmartTableModule } from "ng2-smart-table";
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule,
  NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule,
  NbTooltipModule,
  NbUserModule,
} from "@nebular/theme";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataService } from "../data.service";
import { ApiService } from "../api.service";
import { NgSelectModule } from "@ng-select/ng-select";
import { TranslateModule } from "@ngx-translate/core";
import { NbContextMenuModule } from "@nebular/theme";
import { OngoingTripsComponent } from "./ongoing-trips/ongoing-trips.component";
import { UpcomingTripsComponent } from "./upcoming-trips/upcoming-trips.component";
import { NoResponseTripsComponent } from "./no-response-trips/no-response-trips.component";
import { PastTripsComponent } from "./past-trips/past-trips.component";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { GoogleMapsModule } from "@angular/google-maps";
import { InvoiceDetailsComponent } from "./invoice-details/invoice-details.component";


@NgModule({
  declarations: [
    AllTripsComponent,
    InvoiceDetailsComponent,
    OngoingTripsComponent,
    UpcomingTripsComponent,
    NoResponseTripsComponent,
    PastTripsComponent,
  ],
  imports: [
    CommonModule,
    TripsRoutingModule,
    Ng2SmartTableModule,
    NbCardModule,
    ReactiveFormsModule,
    NbInputModule,
    NbCardModule,
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
    GooglePlaceModule,
    GoogleMapsModule,
    NbContextMenuModule,
    NbTooltipModule,
  ],
  providers: [DataService, ApiService],
})
export class TripsModule {}
