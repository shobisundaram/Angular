import { ExtraOptions, RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import {
  NbAuthComponent,
  NbLoginComponent,
  NbLogoutComponent,
  NbRegisterComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent,
} from "@nebular/auth";
import { APP_BASE_HREF } from "@angular/common";
import { AuthGuard } from "./auth.guard";
import { AuthComponent } from "./auth/auth.component";
import { LoginComponent } from "./auth/login/login.component";
import { ForgetPasswordComponent } from "./auth/forget-password/forget-password.component";
import { CompanyLoginComponent } from "./auth/company-login/company-login.component";

export const routes: Routes = [
  {
    path: "admin",
    loadChildren: () =>
      import("./admin/admin.module").then((m) => m.AdminPanelModule),
      canActivate: [AuthGuard],
  },
  // {
  //   path: "company",
  //   loadChildren: () =>
  //     import("./company/company.module").then((m) => m.CompanyModule),
  //     canActivate: [AuthGuard],
  // },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      {
        path: '',
        component: LoginComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'forget-password',
        component: ForgetPasswordComponent,
      },
      {
        path: 'logout',
        component: NbLogoutComponent,
      },
      {
        path: 'company-login',
        component: CompanyLoginComponent,
      },
      // {
      //   path: 'request-password',
      //   component: NbRequestPasswordComponent,
      // },
      // {
      //   path: 'reset-password',
      //   component: NbResetPasswordComponent,
      // },
    ],
    // path: "auth",
    // component: AuthComponent,
    // loadChildren: () => import("./auth/auth.module").then((m) => m.AuthModule),
  },
  { path: "", redirectTo: "admin", pathMatch: "full" },
  { path: "**", redirectTo: "admin" },
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({                                                                                                                              
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
  providers: [{ provide: APP_BASE_HREF, useValue: "/webadmin" }],
})
export class AppRoutingModule { }
                       