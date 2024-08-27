import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddCompanyComponent } from "./add-company/add-company.component";
import { ViewCompanyComponent } from "./view-company/view-company.component";

const routes: Routes = [
  {
    path: "add-edit-company",
    component: AddCompanyComponent,
  },
  {
    path: "view-company",
    component: ViewCompanyComponent,
  },
  {
    path: "",
    redirectTo: "view-company",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyRoutingModule {}
