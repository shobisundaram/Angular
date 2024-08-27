import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SettingsRoutingModule } from "./settings-routing.module";
import { ConfigComponent } from "./config/config.component";
import { Ng2SmartTableModule } from "ng2-smart-table";
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule,
  NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule,
  NbTooltipModule,
  NbUserModule,
} from "@nebular/theme";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataService } from "../data.service";
import { ApiService } from "../api.service";
import { NgSelectModule } from "@ng-select/ng-select";
import { TranslateModule } from "@ngx-translate/core";
import { NbContextMenuModule } from "@nebular/theme";
import { GeneralSettingsComponent } from "./general-settings/general-settings.component";
import { FirebaseSettingsComponent } from "./firebase-settings/firebase-settings.component";
import { EmailConfigurationComponent } from "./email-configuration/email-configuration.component";
import { SmsConfigurationComponent } from "./sms-configuration/sms-configuration.component";
import { PaymentGatewayConfigurationComponent } from "./payment-gateway-configuration/payment-gateway-configuration.component";

@NgModule({
  declarations: [
    ConfigComponent,
    GeneralSettingsComponent,
    FirebaseSettingsComponent,
    EmailConfigurationComponent,
    SmsConfigurationComponent,
    PaymentGatewayConfigurationComponent,
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
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
    NbTooltipModule,
  ],
  providers: [DataService, ApiService],
})
export class SettingsModule {}
