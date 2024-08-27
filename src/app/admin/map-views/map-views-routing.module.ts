import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HeatMapComponent } from "./heat-map/heat-map.component";
import { PartnerTrackingComponent } from "./partner-tracking/partner-tracking.component";

const routes: Routes = [
  {
    path: "partner-tracking",
    component: PartnerTrackingComponent,
  },
  {
    path: "heat-map",
    component: HeatMapComponent,
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
export class MapViewsRoutingModule {}
