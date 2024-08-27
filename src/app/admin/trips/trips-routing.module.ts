import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AllTripsComponent } from "./all-trips/all-trips.component";
import { InvoiceDetailsComponent } from "./invoice-details/invoice-details.component";
import { NoResponseTripsComponent } from "./no-response-trips/no-response-trips.component";
import { OngoingTripsComponent } from "./ongoing-trips/ongoing-trips.component";
import { PastTripsComponent } from "./past-trips/past-trips.component";
import { UpcomingTripsComponent } from "./upcoming-trips/upcoming-trips.component";

const routes: Routes = [
  {
    path: "all-trips",
    component: AllTripsComponent,
  },
  {
    path: "ongoing-trips",
    component: OngoingTripsComponent,
  },
  {
    path: "upcoming-trips",
    component: UpcomingTripsComponent,
  },
  {
    path: "no-response-trips",
    component: NoResponseTripsComponent,
  },
  {
    path: "past-trips",
    component: PastTripsComponent,
  },
  {
    path: "invoice-details",
    component: InvoiceDetailsComponent,
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
export class TripsRoutingModule {}
