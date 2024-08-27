import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPartnerComponent } from './add-partner/add-partner.component';
import { ViewPartnerComponent } from './view-partner/view-partner.component';

const routes: Routes = [
  {
    path: "add-edit-partner",
    component: AddPartnerComponent,
  },
  {
    path: "view-partner",
    component: ViewPartnerComponent,
  },
  {
    path: "",
    redirectTo: "view-partner",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartnerRoutingModule { }
