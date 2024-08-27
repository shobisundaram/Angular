import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddListServicesComponent } from "./listservices/add-list-services/add-list-services.component";
import { ViewListServicesComponent } from "./listservices/view-list-services/view-list-services.component";
import { AddPriceingComponent } from "./priceing/add-priceing/add-priceing.component";
import { ViewPriceingComponent } from "./priceing/view-priceing/view-priceing.component";
import { AddServiceAvailableCitysComponent } from "./serviceavailablecitys/add-service-available-citys/add-service-available-citys.component";
import { ViewServiceAvailableCitysComponent } from "./serviceavailablecitys/view-service-available-citys/view-service-available-citys.component";
import { AddOutstationPackagesComponent } from "./outstation/add-outstation-packages/add-outstation-packages.component";
import { ViewOutstationPackagesComponent } from "./outstation/view-outstation-packages/view-outstation-packages.component";
import { AddOutstationVehicleComponent } from "./outstation/add-outstation-vehicle/add-outstation-vehicle.component";

const routes: Routes = [
  {
    path: "add-edit-service-available-citys",
    component: AddServiceAvailableCitysComponent,
  },
  {
    path: "view-service-available-citys",
    component: ViewServiceAvailableCitysComponent,
  },
  {
    path: "add-edit-list-services",
    component: AddListServicesComponent,
  },
  {
    path: "view-list-services",
    component: ViewListServicesComponent,
  },
  {
    path: "add-edit-priceing",
    component: AddPriceingComponent,
  },
  {
    path: "view-priceing",
    component: ViewPriceingComponent,
  },
  {
    path: "add-outstation-package",
    component: AddOutstationPackagesComponent,
  },
  {
    path: "add-outstation-vehicle",
    component: AddOutstationVehicleComponent,
  },
  {
    path: "view-outstation-package",
    component: ViewOutstationPackagesComponent,
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
export class ServicesRoutingModule {}
