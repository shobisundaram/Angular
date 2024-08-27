import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DispatchRoutingModule } from "./dispatch-routing.module";
import { ManualTaxiDispatchComponent } from "./manual-taxi-dispatch/manual-taxi-dispatch.component";
import { Ng2SmartTableModule } from "ng2-smart-table";
import {
  NbActionsModule,
  NbAutocompleteModule,
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
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { TimePickerModule } from "@syncfusion/ej2-angular-calendars";
import { environment } from "../../../environments/environment";
import { GoogleMapsModule } from "@angular/google-maps";
@NgModule({
  declarations: [ManualTaxiDispatchComponent],
  imports: [
    CommonModule,
    DispatchRoutingModule,
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
    TimePickerModule,
    NbTooltipModule,
    NbContextMenuModule,
    GooglePlaceModule,
    GoogleMapsModule,
    NbAutocompleteModule
  ],
  providers: [DataService, ApiService],
})
export class DispatchModule {}
