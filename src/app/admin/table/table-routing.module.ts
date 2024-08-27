import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SmartTableComponent } from "./smart-table/smart-table.component";
import { TableComponent } from "./table.component";

const routes: Routes = [
  {
    path: "",
    component: TableComponent,
    children: [
      {
        path: "smart-table",
        component: SmartTableComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TableRoutingModule {}
