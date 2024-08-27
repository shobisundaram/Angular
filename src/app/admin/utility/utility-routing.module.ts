import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddCountryComponent } from "./countries/add-country/add-country.component";
import { ViewCountryComponent } from "./countries/view-country/view-country.component";
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
import { AddAdminGroupComponent } from "./adminGroup/add-admin-group/add-admin-group.component";
import { ViewAdminGroupComponent } from "./adminGroup/view-admin-group/view-admin-group.component";
import { ViewCurrencyComponent } from "./currency/view-currency/view-currency.component";
import { AddCurrencyComponent } from "./currency/add-currency/add-currency.component";

const routes: Routes = [
  {
    path: "add-edit-amdin-group",
    component: AddAdminGroupComponent,
  },
  {
    path: "view-amdin-group",
    component: ViewAdminGroupComponent,
  },
  {
    path: "add-edit-onboard",
    component: AddOnboardComponent,
  },
  {
    path: "view-onboard",
    component: ViewOnboardComponent,
  },
  {
    path: "add-edit-country",
    component: AddCountryComponent,
  },
  {
    path: "view-country",
    component: ViewCountryComponent,
  },
  {
    path: "add-edit-state",
    component: AddStateComponent,
  },
  {
    path: "view-state",
    component: ViewStateComponent,
  },
  {
    path: "add-edit-city",
    component: AddCityComponent,
  },
  {
    path: "view-city",
    component: ViewCityComponent,
  },
  {
    path: "add-edit-currency",
    component: AddCurrencyComponent,
  },
  {
    path: "view-currency",
    component: ViewCurrencyComponent,
  },
  {
    path: "add-edit-make",
    component: AddMakeComponent,
  },
  {
    path: "view-make",
    component: ViewMakeComponent,
  },
  {
    path: "add-edit-model",
    component: AddModelComponent,
  },
  {
    path: "view-model",
    component: ViewModelComponent,
  },
  {
    path: "",
    redirectTo: "/admin/dashboard",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UtilityRoutingModule { }
