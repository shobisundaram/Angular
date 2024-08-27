import { Component, OnInit } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { ApiService } from "../../api.service";
import { DataService } from "../../data.service";

@Component({
  selector: "ngx-site-statistics",
  templateUrl: "./site-statistics.component.html",
  styleUrls: ["./site-statistics.component.scss"],
})
export class SiteStatisticsComponent implements OnInit {
  period: any = "year";
  pieChartPeriod: any = "year";
  dropdownList: any;
  selCity: any;

  constructor(
    private dataService: DataService,
    private apiservice: ApiService,
    private toasterService: NbToastrService
  ) {
    this.apiservice.CommonGetApi("creteria/serviceArea/list").subscribe({
      next: (res) => {
        this.dataService.setNewRowInfo(res);
      },
      error: (error) => {
        this.toasterService.danger(error.error.message);
      },
    });
  }

  ngOnInit(): void {}

  Filter() {}

  setPeriodAndGetChartData(value: any): void {
    if (this.period !== value) {
      this.period = value;
    }
  }

  setPieChartPeriodAndGetChartData(value: any): void {
    if (this.pieChartPeriod !== value) {
      this.pieChartPeriod = value;
    }
  }
}
