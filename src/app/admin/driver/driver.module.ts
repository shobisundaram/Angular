import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DriverRoutingModule } from "./driver-routing.module";
import { AddDriverComponent } from "./add-driver/add-driver.component";
import { ViewDriverComponent } from "./view-driver/view-driver.component";
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
  NbTabsetModule,
  NbTooltipModule,
  NbUserModule,
} from "@nebular/theme";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataService } from "../data.service";
import { ApiService } from "../api.service";
import { NgSelectModule } from "@ng-select/ng-select";
import { TranslateModule } from "@ngx-translate/core";
import { NbContextMenuModule } from "@nebular/theme";
import { AddDrivertaxiComponent } from "./add-drivertaxi/add-drivertaxi.component";
import { AdminPanelModule } from "../admin.module";

@NgModule({
  declarations: [
    AddDriverComponent,
    ViewDriverComponent,
    AddDrivertaxiComponent,
  ],
  imports: [
    CommonModule,
    DriverRoutingModule,
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
    NbTabsetModule,
    NbAccordionModule,
    AdminPanelModule,
    NbTooltipModule,
  ],
  providers: [DataService, ApiService],
})
export class DriverModule {}
