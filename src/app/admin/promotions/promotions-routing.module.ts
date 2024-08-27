import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddPromotionsComponent } from "./add-promotions/add-promotions.component";
import { ViewPromotionsComponent } from "./view-promotions/view-promotions.component";

const routes: Routes = [
  {
    path: "add-edit-coupons",
    component: AddPromotionsComponent,
  },
  {
    path: "view-coupons",
    component: ViewPromotionsComponent,
  },
  {
    path: "",
    redirectTo: "view-promotions",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PromotionsRoutingModule {}
