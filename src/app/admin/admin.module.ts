import { NgModule } from "@angular/core";
import { Ng2SmartTableModule } from "ng2-smart-table";
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbDialogModule,
  NbIconModule,
  NbListModule,
  NbMenuModule,
  NbInputModule,
  NbSelectModule,
  NbTabsetModule,
  NbTooltipModule,
  NbUserModule,
  NbDatepickerModule,
  NbTimepickerModule,
} from "@nebular/theme";

import { ThemeModule } from "../@theme/theme.module";
import { AdminPanelComponent } from "./admin.component";
import { AdminPanelRoutingModule } from "./admin-routing.module";
import { DashboardComponent } from "./dashboard-components/dashboard/dashboard.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { TranslateModule } from "@ngx-translate/core";
import { DeleteDialogComponent } from "./delete-dialog/delete-dialog.component";
import { SolarChartDriverComponent } from "./dashboard-components/solar/solar-chart-driver/solar-chart-driver.component";
import { SolarChartRiderComponent } from "./dashboard-components/solar/solar-chart-rider/solar-chart-rider.component";
import { NgxEchartsModule } from "ngx-echarts";
import { RecentUsersComponent } from "./dashboard-components/contact/recent-users/recent-users.component";
import { LowratedUsersComponent } from "./dashboard-components/contact/lowrated-users/lowrated-users.component";
import { SiteStatisticsComponent } from "./site-statistics-component/site-statistics/site-statistics.component";
import { FirstChartComponent } from "./site-statistics-component/first-chart/first-chart.component";
import { SecondChartComponent } from "./site-statistics-component/second-chart/second-chart.component";
import { ThirdChartComponent } from "./site-statistics-component/third-chart/third-chart.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DatePickerComponent } from "./date-picker/date-picker.component";
import { NgSelectComponent } from "./ng-select/ng-select.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { CustomFilterComponent } from './custom-filter/custom-filter.component';
import { ElectricityComponent } from './dashboard-components/electricity/electricity.component';
import { ElectricityChartComponent } from './dashboard-components/electricity/electricity-chart/electricity-chart.component';
import { RouterModule } from "@angular/router";
// import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { NotificationsComponent } from '../header-components/notifications/notifications.component';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { HeaderComponentsModule } from "../header-components/header-components.module";

@NgModule({
  imports: [
    AdminPanelRoutingModule,
    Ng2SmartTableModule,
    ThemeModule,
    NbMenuModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    TranslateModule,
    NbDialogModule.forRoot(),
    NbTooltipModule,
    NbActionsModule,
    NbDatepickerModule,
    NbTimepickerModule,
    NbTabsetModule,
    NbListModule,
    NbUserModule,
    NbInputModule,
    FormsModule,
    ReactiveFormsModule,
    NbSelectModule,
    InfiniteScrollModule,
    NgxEchartsModule,
    NgSelectModule,
    HeaderComponentsModule,
  ],
  declarations: [
    AdminPanelComponent,
    DashboardComponent,
    NotFoundComponent,
    DeleteDialogComponent,
    SolarChartDriverComponent,
    SolarChartRiderComponent,
    RecentUsersComponent,
    LowratedUsersComponent,
    SiteStatisticsComponent,
    FirstChartComponent,
    SecondChartComponent,
    ThirdChartComponent,
    DatePickerComponent,
    NgSelectComponent,
    CustomFilterComponent,
    ElectricityComponent,
    ElectricityChartComponent,
    NotificationsComponent,
  ],
  exports: [DeleteDialogComponent],
})
export class AdminPanelModule {}
