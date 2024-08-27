import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { OffersRoutingModule } from "./offers-routing.module";
import { AddOfferComponent } from "./add-offer/add-offer.component";
import { ViewOfferComponent } from "./view-offer/view-offer.component";
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
import { AdminPanelModule } from "../admin.module";

@NgModule({
  declarations: [AddOfferComponent, ViewOfferComponent],
  imports: [
    CommonModule,
    OffersRoutingModule,
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
    AdminPanelModule,
    NbTooltipModule,
  ],
  providers: [DataService, ApiService],
})
export class OffersModule {}
