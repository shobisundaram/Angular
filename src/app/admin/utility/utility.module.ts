import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UtilityRoutingModule } from "./utility-routing.module";
import { AddCountryComponent } from "./countries/add-country/add-country.component";
import { ViewCountryComponent } from "./countries/view-country/view-country.component";
import { Ng2SmartTableModule } from "ng2-smart-table";
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule,
  NbIconModule,
  NbInputModule,
  NbListModule,
  NbRadioModule,
  NbSelectModule,
  NbToggleModule,
  NbTooltipModule,
  NbUserModule,
} from "@nebular/theme";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataService } from "../data.service";
import { ApiService } from "../api.service";
import { NgSelectModule } from "@ng-select/ng-select";
import { TranslateModule } from "@ngx-translate/core";
import { NbContextMenuModule } from "@nebular/theme";
import { AddStateComponent } from "./states/add-state/add-state.component";
import { ViewStateComponent } from "./states/view-state/view-state.component";
import { AddCityComponent } from "./cities/add-city/add-city.component";
import { ViewCityComponent } from "./cities/view-city/view-city.component";
import { AddMakeComponent } from "./make/add-make/add-make.component";
import { ViewMakeComponent } from "./make/view-make/view-make.component";
import { AddModelComponent } from "./model/add-model/add-model.component";
import { ViewModelComponent } from "./model/view-model/view-model.component";
import { AddOnboardComponent } from "./onboard/add-onboard/add-onboard.component";
import { ViewOnboardComponent } from "./onboard/view-onboard/view-onboard.component";
import { AdminPanelModule } from "../admin.module";
import { AddAdminGroupComponent } from "./adminGroup/add-admin-group/add-admin-group.component";
import { ViewAdminGroupComponent } from "./adminGroup/view-admin-group/view-admin-group.component";
import { AddCurrencyComponent } from './currency/add-currency/add-currency.component';
import { ViewCurrencyComponent } from './currency/view-currency/view-currency.component';

@NgModule({
  declarations: [
    AddCountryComponent,
    ViewCountryComponent,
    AddStateComponent,
    ViewStateComponent,
    AddCityComponent,
    ViewCityComponent,
    AddMakeComponent,
    ViewMakeComponent,
    AddModelComponent,
    ViewModelComponent,
    AddOnboardComponent,
    ViewOnboardComponent,
    AddAdminGroupComponent,
    ViewAdminGroupComponent,
    AddCurrencyComponent,
    ViewCurrencyComponent,
  ],
  imports: [
    CommonModule,
    UtilityRoutingModule,
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
    NbToggleModule,
    NbListModule,
  ],
  providers: [DataService, ApiService],
})
export class UtilityModule { }
