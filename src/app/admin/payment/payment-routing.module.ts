import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddPackageListComponent } from "./package-list/add-package-list/add-package-list.component";
import { ViewPackageListComponent } from "./package-list/view-package-list/view-package-list.component";
import { AddDriverCreditComponent } from "./driver-credit/add-driver-credit/add-driver-credit.component";
import { ViewDriverCreditComponent } from "./driver-credit/view-driver-credit/view-driver-credit.component";
import { ViewDriverSubscriptionComponent } from "./driver-subscription/view-driver-subscription/view-driver-subscription.component";

const routes: Routes = [
  {
    path: "credit/view-partner-credit",
    component: ViewDriverCreditComponent,
  },
  {
    path: "credit/add-partner-credit",
    component: AddDriverCreditComponent,
  },
  {
    path: "subscription/view-partner-subscription",
    component: ViewDriverSubscriptionComponent,
  },
  {
    path: "package-list/view-package-list",
    component: ViewPackageListComponent,
  },
  {
    path: "package-list/add-package-list",
    component: AddPackageListComponent,
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
export class PaymentRoutingModule {}
