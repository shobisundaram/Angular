import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddEditAdminComponent } from "./add-edit-admin/add-edit-admin.component";
import { AdminProfileComponent } from "./admin-profile/admin-profile.component";
import { ViewAdminComponent } from "./view-admin/view-admin.component";

const routes: Routes = [
  {
    path: "view-admin",
    component: ViewAdminComponent,
  },
  {
    path: "add-edit-admin",
    component: AddEditAdminComponent,
  },
  {
    path: "admin-profile",
    component: AdminProfileComponent,
  },
  {
    path: "",
    redirectTo: "view-admin",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
