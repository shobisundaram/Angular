import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ServicesRoutingModule } from "./services-routing.module";
import { AddServiceAvailableCitysComponent } from "./serviceavailablecitys/add-service-available-citys/add-service-available-citys.component";
import { ViewServiceAvailableCitysComponent } from "./serviceavailablecitys/view-service-available-citys/view-service-available-citys.component";
import { Ng2SmartTableModule } from "ng2-smart-table";
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbContextMenuModule,
  NbDatepickerModule,
  NbTimepickerModule,
  NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule,
  NbTagModule,
  NbToggleModule,
  NbTooltipModule,
  NbUserModule,
} from "@nebular/theme";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataService } from "../data.service";
import { ApiService } from "../api.service";
import { NgSelectModule } from "@ng-select/ng-select";
import { TranslateModule } from "@ngx-translate/core";
import { AddListServicesComponent } from "./listservices/add-list-services/add-list-services.component";
import { ViewListServicesComponent } from "./listservices/view-list-services/view-list-services.component";
import { environment } from "../../../environments/environment";
import { AddPriceingComponent } from "./priceing/add-priceing/add-priceing.component";
import { ViewPriceingComponent } from "./priceing/view-priceing/view-priceing.component";
import { AdminPanelModule } from "../admin.module";
import { GoogleMapsModule } from "@angular/google-maps";
import { AddOutstationPackagesComponent } from './outstation/add-outstation-packages/add-outstation-packages.component';
import { ViewOutstationPackagesComponent } from './outstation/view-outstation-packages/view-outstation-packages.component';
import { AddOutstationVehicleComponent } from './outstation/add-outstation-vehicle/add-outstation-vehicle.component';

@NgModule({
  declarations: [
    AddServiceAvailableCitysComponent,
    ViewServiceAvailableCitysComponent,
    AddListServicesComponent,
    ViewListServicesComponent,
    AddPriceingComponent,
    ViewPriceingComponent,
    AddOutstationPackagesComponent,
    ViewOutstationPackagesComponent,
    AddOutstationVehicleComponent,
  ],
  imports: [
    CommonModule,
    ServicesRoutingModule,
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
    NbTimepickerModule,
    NbSelectModule,
    NbIconModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NbContextMenuModule,
    NbTagModule,
    NbToggleModule,
    GoogleMapsModule,
    AdminPanelModule,
    NbTooltipModule,
  ],
  providers: [DataService, ApiService],
})
export class ServicesModule {}
