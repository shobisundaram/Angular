import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyComponent } from './company.component';
import { DashboardComponent } from './dashboard-components/dashboard/dashboard.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';

const routes: Routes = [
  {
    path: "",
    component: CompanyComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: "delete-dialog",
        component: DeleteDialogComponent,
      },
      {
        path: "partner",
        loadChildren: () =>
          import("./partner/partner.module").then((m) => m.PartnerModule),
      },
      {
        path: "vehicle",
        loadChildren: () =>
          import("./vehicle/vehicle.module").then((m) => m.VehicleModule),
      },
      {
        path: "trips",
        loadChildren: () =>
          import("./trips/trips.module").then((m) => m.TripsModule),
      },
      {
        path: "reports",
        loadChildren: () =>
          import("./reports/reports.module").then((m) => m.ReportsModule),
      },
      {
        path: "dispatch",
        loadChildren: () =>
          import("./dispatch/dispatch.module").then((m) => m.DispatchModule),
      },
      {
        path: "payment",
        loadChildren: () =>
          import("./payment/payment.module").then((m) => m.PaymentModule),
      },
      {
        path: "map-views",
        loadChildren: () =>
          import("./map-views/map-views.module").then((m) => m.MapViewsModule),
      },
      {
        path: "settlement",
        loadChildren: () =>
          import("./settlement/settlement.module").then((m) => m.SettlementModule),
      },
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full",
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
