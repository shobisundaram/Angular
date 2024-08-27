import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PromotionsRoutingModule } from "./promotions-routing.module";
import { AddPromotionsComponent } from "./add-promotions/add-promotions.component";
import { ViewPromotionsComponent } from "./view-promotions/view-promotions.component";
import { Ng2SmartTableModule } from "ng2-smart-table";
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule,
  NbTimepickerModule,
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
  declarations: [AddPromotionsComponent, ViewPromotionsComponent],
  imports: [
    CommonModule,
    PromotionsRoutingModule,
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
    NbTimepickerModule
  ],
  providers: [DataService, ApiService],
})
export class PromotionsModule {}
