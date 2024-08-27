import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyRoutingModule } from './company-routing.module';
import { CompanyComponent } from './company.component';
import { NbButtonModule, NbCardModule, NbDialogModule, NbIconModule, NbListModule, NbMenuModule, NbSelectModule, NbTabsetModule } from '@nebular/theme';
import { ThemeModule } from '../@theme/theme.module';
import { CompanyCustomFilterComponent } from './company-custom-filter/company-custom-filter.component';
import { CompanyNgSelectComponent } from './company-ng-select/company-ng-select.component';
import { CompanyDatePickerComponent } from './company-date-picker/company-date-picker.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { DashboardComponent } from './dashboard-components/dashboard/dashboard.component';
import { ElectricityChartComponent } from './dashboard-components/electricity/electricity-chart/electricity-chart.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { ElectricityComponent } from './dashboard-components/electricity/electricity.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ElectricityChartComponent,
    CompanyComponent,
    CompanyCustomFilterComponent,
    CompanyNgSelectComponent,
    CompanyDatePickerComponent,
    DeleteDialogComponent,
    ElectricityComponent,
    CompanyDatePickerComponent
  ],
  imports: [
    CommonModule,
    ThemeModule,
    NbIconModule,
    NbMenuModule,
    NbButtonModule,
    FormsModule,
    NbListModule,
    NbTabsetModule,
    NbDialogModule.forRoot(),
    NbCardModule,
    TranslateModule,
    ReactiveFormsModule,
    NbSelectModule,
    NgSelectModule,
    NgxEchartsModule,
    CompanyRoutingModule
  ],
  exports: [DeleteDialogComponent],
})
export class CompanyModule { }
