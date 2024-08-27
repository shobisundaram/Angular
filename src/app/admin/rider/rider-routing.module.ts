import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddRiderComponent } from "./add-rider/add-rider.component";
import { ViewRiderComponent } from "./view-rider/view-rider.component";

const routes: Routes = [
  {
    path: "add-edit-customer",
    component: AddRiderComponent,
  },
  {
    path: "view-customer",
    component: ViewRiderComponent,
  },
  {
    path: "",
    redirectTo: "view-customer",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RiderRoutingModule {}
