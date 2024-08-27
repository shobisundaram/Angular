import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { TableRoutingModule } from "./table-routing.module";
import { SmartTableComponent } from "./smart-table/smart-table.component";
import { TableComponent } from "./table.component";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { NbCardModule } from "@nebular/theme";

@NgModule({
  declarations: [SmartTableComponent, TableComponent],
  imports: [
    CommonModule,
    TableRoutingModule,
    Ng2SmartTableModule,
    NbCardModule,
  ],
})
export class TableModule {}
