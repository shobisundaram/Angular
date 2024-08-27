import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ConfigComponent } from "./config/config.component";
import { EmailConfigurationComponent } from "./email-configuration/email-configuration.component";
import { FirebaseSettingsComponent } from "./firebase-settings/firebase-settings.component";
import { GeneralSettingsComponent } from "./general-settings/general-settings.component";
import { PaymentGatewayConfigurationComponent } from "./payment-gateway-configuration/payment-gateway-configuration.component";
import { SmsConfigurationComponent } from "./sms-configuration/sms-configuration.component";

const routes: Routes = [
  {
    path: "config",
    component: ConfigComponent,
  },
  {
    path: "general-settings",
    component: GeneralSettingsComponent,
  },
  {
    path: "firebase-settings",
    component: FirebaseSettingsComponent,
  },
  {
    path: "email-configuration",
    component: EmailConfigurationComponent,
  },
  {
    path: "sms-configuration",
    component: SmsConfigurationComponent,
  },
  {
    path: "payment-gateway-configuration",
    component: PaymentGatewayConfigurationComponent,
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
export class SettingsRoutingModule {}
