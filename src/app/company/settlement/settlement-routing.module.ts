import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartnerSettlementComponent } from './partner-settlement/partner-settlement.component';

const routes: Routes = [
  {
    path: "partner-settlement",
    component: PartnerSettlementComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettlementRoutingModule { }
