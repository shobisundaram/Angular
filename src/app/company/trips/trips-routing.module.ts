import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllTripsComponent } from './all-trips/all-trips.component';
import { InvoiceDetailsComponent } from './invoice-details/invoice-details.component';


const routes: Routes = [
  {
    path: "all-trips",
    component: AllTripsComponent,
  },
  {
    path: "invoice-details",
    component: InvoiceDetailsComponent
  },
  {
    path: "",
    redirectTo: "/company/dashboard",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TripsRoutingModule { }
