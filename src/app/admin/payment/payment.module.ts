import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PaymentRoutingModule } from "./payment-routing.module";
import { ViewPackageListComponent } from "./package-list/view-package-list/view-package-list.component";
import { AddPackageListComponent } from "./package-list/add-package-list/add-package-list.component";
import { ViewDriverCreditComponent } from "./driver-credit/view-driver-credit/view-driver-credit.component";
import { AddDriverCreditComponent } from "./driver-credit/add-driver-credit/add-driver-credit.component";
import { Ng2SmartTableModule } from "ng2-smart-table";
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbContextMenuModule,
  NbDatepickerModule,
  NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule,
  NbTagModule,
  NbToggleModule,
  NbTooltipModule,
  NbUserModule,
} from "@nebular/theme";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataService } from "../data.service";
import { ApiService } from "../api.service";
import { NgSelectModule } from "@ng-select/ng-select";
import { TranslateModule } from "@ngx-translate/core";
import { AdminPanelModule } from "../admin.module";
import { ViewDriverSubscriptionComponent } from './driver-subscription/view-driver-subscription/view-driver-subscription.component';
import { SubscriptionStatusChangeComponent } from './driver-subscription/subscription-status-change/subscription-status-change.component';

@NgModule({
  declarations: [
    ViewPackageListComponent,
    AddPackageListComponent,
    ViewDriverCreditComponent,
    AddDriverCreditComponent,
    ViewDriverSubscriptionComponent,
    SubscriptionStatusChangeComponent,
  ],
  imports: [
    CommonModule,
    PaymentRoutingModule,
    Ng2SmartTableModule,
    NbCardModule,
    ReactiveFormsModule,
    NbInputModule,
    NbCardModule,
    NbButtonModule,
    NbActionsModule,
    NbUserModule,
    NbCheckboxModule,
    NbRadioModule,
    NbDatepickerModule,
    NbSelectModule,
    NbIconModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NbContextMenuModule,
    NbTagModule,
    NbToggleModule,
    AdminPanelModule,
    NbTooltipModule,
  ],
  providers: [DataService, ApiService],
})
export class PaymentModule {}
