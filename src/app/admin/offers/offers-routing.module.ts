import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddOfferComponent } from "./add-offer/add-offer.component";
import { ViewOfferComponent } from "./view-offer/view-offer.component";

const routes: Routes = [
  {
    path: "add-edit-offer",
    component: AddOfferComponent,
  },
  {
    path: "view-offer",
    component: ViewOfferComponent,
  },
  {
    path: "",
    redirectTo: "view-offer",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OffersRoutingModule {}
