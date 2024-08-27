import { Component, OnDestroy, OnInit } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { ApiService } from "../../api.service";

@Component({
  selector: "ngx-dashboard",
  styleUrls: ["./dashboard.component.scss"],
  templateUrl: "./dashboard.component.html",
})
export class DashboardComponent implements OnDestroy {
  companysCount: string = "0";
  partnersCount: string = "0";
  vehiclesCount: string = "0";
  ridersCount: string = "0";
  totalTripsCount: string = "0";
  totalTripPayment: string = "0";
  totalTripCommission: string = "0";
  totalPartnerEarned: string = "0";
  // types = ['week', 'month', 'year'];
  constructor(
    private apiservice: ApiService,
    private toasterService: NbToastrService
  ) {}

  ngOnInit() {
    this.apiservice.CommonGetApi("common/report/dashboard").subscribe({
      next: (res) => {
        let totalRecords = res.data.totalRecord

        this.companysCount = totalRecords.company;
        this.partnersCount = totalRecords.partner;
        this.vehiclesCount = totalRecords.vehicle
        this.ridersCount = totalRecords.customer

        this.totalTripsCount = totalRecords.trip

        let totalEarnings = res.data.tripEarning
        this.totalTripPayment = totalEarnings.trip
        this.totalTripCommission = totalEarnings.admin
        this.totalPartnerEarned = totalEarnings.partner
      },
      error: (error) => {
        this.toasterService.danger(error.error.message);
      },
    });
  }

  ngOnDestroy() {}
}
