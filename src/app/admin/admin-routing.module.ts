import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { AdminPanelComponent } from "./admin.component";
import { DashboardComponent } from "./dashboard-components/dashboard/dashboard.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { DeleteDialogComponent } from "./delete-dialog/delete-dialog.component";
import { SiteStatisticsComponent } from "./site-statistics-component/site-statistics/site-statistics.component";
import { NotificationsComponent } from "../header-components/notifications/notifications.component";

const routes: Routes = [
  {
    path: "",
    component: AdminPanelComponent,
    children: [
      {
        path: "dashboard",
        component: DashboardComponent,
      },
      {
        path: "site-statistics",
        component: SiteStatisticsComponent,
      },
      {
        path: "404",
        component: NotFoundComponent,
      },
      {
        path: "delete-dialog",
        component: DeleteDialogComponent,
      },
      {
        path: "notifications",
        component: NotificationsComponent,
      },
      {
        path: "tables",
        loadChildren: () =>
          import("./table/table.module").then((m) => m.TableModule),
      },
      {
        path: "admin",
        loadChildren: () =>
          import("./admin/admin.module").then((m) => m.AdminModule),
      },
      {
        path: "company",
        loadChildren: () =>
          import("./company/company.module").then((m) => m.CompanyModule),
      },
      {
        path: "partner",
        loadChildren: () =>
          import("./driver/driver.module").then((m) => m.DriverModule),
      },
      {
        path: "company-vehicle",
        loadChildren: () =>
          import("./company-vehicle/company-vehicle.module").then(
            (m) => m.CompanyVehicleModule
          ),
      },
      {
        path: "customer",
        loadChildren: () =>
          import("./rider/rider.module").then((m) => m.RiderModule),
      },
      {
        path: "trips",
        loadChildren: () =>
          import("./trips/trips.module").then((m) => m.TripsModule),
      },
      {
        path: "dispatch",
        loadChildren: () =>
          import("./dispatch/dispatch.module").then((m) => m.DispatchModule),
      },
      {
        path: "map-views",
        loadChildren: () =>
          import("./map-views/map-views.module").then((m) => m.MapViewsModule),
      },
      {
        path: "payment",
        loadChildren: () =>
          import("./payment/payment.module").then((m) => m.PaymentModule),
      },
      {
        path: "coupons",
        loadChildren: () =>
          import("./promotions/promotions.module").then(
            (m) => m.PromotionsModule
          ),
      },
      {
        path: "offers",
        loadChildren: () =>
          import("./offers/offers.module").then((m) => m.OffersModule),
      },
      {
        path: "reports",
        loadChildren: () =>
          import("./reports/reports.module").then((m) => m.ReportsModule),
      },
      {
        path: "services",
        loadChildren: () =>
          import("./services/services.module").then((m) => m.ServicesModule),
      },
      {
        path: "utility",
        loadChildren: () =>
          import("./utility/utility.module").then((m) => m.UtilityModule),
      },
      {
        path: "settings",
        loadChildren: () =>
          import("./settings/settings.module").then((m) => m.SettingsModule),
      },
      {
        path: "languages",
        loadChildren: () =>
          import("./languages/language.module").then((m) => m.LanguageModule),
      },
      {
        path: "translation",
        loadChildren: () =>
          import("./translation/translation.module").then((m) => m.TranslationModule),
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
      {
        path: "**",
        component: NotFoundComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPanelRoutingModule {}
