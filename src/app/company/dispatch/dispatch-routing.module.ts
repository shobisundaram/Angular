import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ManualTaxiDispatchComponent } from "./manual-taxi-dispatch/manual-taxi-dispatch.component";

const routes: Routes = [
  {
    path: "manual-taxi-dispatch",
    component: ManualTaxiDispatchComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DispatchRoutingModule {}
