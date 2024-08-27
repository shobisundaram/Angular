import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CompanyVehicleRoutingModule } from "./company-vehicle-routing.module";
import { AddVehicleComponent } from "./add-vehicle/add-vehicle.component";
import { ViewVehicleComponent } from "./view-vehicle/view-vehicle.component";
import { Ng2SmartTableModule } from "ng2-smart-table";
import {
  NbAccordionModule,
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
import { AdminPanelModule } from "../admin.module";

@NgModule({
  declarations: [AddVehicleComponent, ViewVehicleComponent],
  imports: [
    CommonModule,
    CompanyVehicleRoutingModule,
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
    NbContextMenuModule,
    NbAccordionModule,
    AdminPanelModule,
    NbTooltipModule,
  ],
  providers: [DataService, ApiService],
})
export class CompanyVehicleModule {}
