import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddDriverComponent } from "./add-driver/add-driver.component";
import { AddDrivertaxiComponent } from "./add-drivertaxi/add-drivertaxi.component";
import { ViewDriverComponent } from "./view-driver/view-driver.component";

const routes: Routes = [
  {
    path: "add-edit-partner",
    component: AddDriverComponent,
  },
  {
    path: "view-partner",
    component: ViewDriverComponent,
  },
  {
    path: "add-partnertaxi",
    component: AddDrivertaxiComponent,
  },
  {
    path: "",
    redirectTo: "view-partner",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DriverRoutingModule {}
