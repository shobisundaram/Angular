import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AdminRoutingModule } from "./admin-routing.module";
import { ViewAdminComponent } from "./view-admin/view-admin.component";
import { AddEditAdminComponent } from "./add-edit-admin/add-edit-admin.component";
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
import { AdminProfileComponent } from "./admin-profile/admin-profile.component";
import { AdminPanelModule } from "../admin.module";


@NgModule({
  declarations: [
    ViewAdminComponent,
    AddEditAdminComponent,
    AdminProfileComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
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
    AdminPanelModule,
    NbTooltipModule,
  ],
  providers: [DataService, ApiService],
})
export class AdminModule {}
