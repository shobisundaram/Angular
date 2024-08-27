import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MapViewsRoutingModule } from "./map-views-routing.module";
import { PartnerTrackingComponent } from "./partner-tracking/partner-tracking.component";
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbContextMenuModule,
  NbDatepickerModule,
  NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule,
  NbTagModule,
  NbToggleModule,
  NbUserModule,
} from "@nebular/theme";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataService } from "../data.service";
import { ApiService } from "../api.service";
import { NgSelectModule } from "@ng-select/ng-select";
import { TranslateModule } from "@ngx-translate/core";
import { environment } from "../../../environments/environment";
import { GoogleMapsModule } from "@angular/google-maps";
import { HeatMapComponent } from './heat-map/heat-map.component';

@NgModule({
  declarations: [PartnerTrackingComponent, HeatMapComponent],
  imports: [
    CommonModule,
    MapViewsRoutingModule,
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
    NbContextMenuModule,
    NbTagModule,
    NbToggleModule,
    GoogleMapsModule,
    // AgmCoreModule.forRoot({
    //   apiKey: environment.GoogleMapKey,
    //   libraries: ["places", "drawing", "geometry"],
    // }),
  ],
  providers: [DataService, ApiService],
})
export class MapViewsModule {}
