import {
  AfterViewInit,
  Component,
  OnDestroy,
  Output,
  EventEmitter,
  Input,
} from "@angular/core";
import { NbThemeService, NbToastrService } from "@nebular/theme";
import { ApiService } from "../../api.service";
import { DatePipe } from "@angular/common";
import * as moment from "moment";
import { DataService } from "../../data.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "ngx-first-chart",
  templateUrl: "./first-chart.component.html",
  styleUrls: ["./first-chart.component.scss"],
})
export class FirstChartComponent implements AfterViewInit, OnDestroy {
  options: any = {};
  themeSubscription: any;
  vals: any;
  months: any;
  total: number[] = new Array(12);
  onlinePay: number[] = new Array(12);
  cash: number[] = new Array(12);
  damt: number[] = new Array(12);
  gamt: number[] = new Array(12);

  @Output() periodChange = new EventEmitter<string>();
  @Input() type: any = "year";
  types = [
    {
      label: this.translateService.instant("DASHBOARD.WEEK"),
      value: 'week'
    },
    {
      label: this.translateService.instant("DASHBOARD.MONTH"),
      value: 'month'
    },
    {
      label: this.translateService.instant("DASHBOARD.YEAR"),
      value: 'year'
    }
  ];

  dateObj = {};
  list = new Date();
  getMonthName;
  city: string = "Service Available City";
  SerivceCity: any;
  showCity: boolean;
  changePeriod(period: any): void {
    this.type = period;
    this.periodChange.emit(period);
    this.dispChart();
  }

  changeCity(data) {
    this.city = data;
    this.dispChart();
  }

  constructor(
    private theme: NbThemeService,
    private datePipe: DatePipe,
    private dataService: DataService,
    private apiservice: ApiService,
    private translateService: TranslateService,
    private toasterService: NbToastrService
  ) {
    this.dateObj["list"] = this.datePipe.transform(this.list, "yyyy-MM-dd");
    this.dispChart();
    this.dataService.getNewRowInfo()
      .subscribe((res) => {
        if (res && res.data) {
          this.SerivceCity = res.data.serviceArea;
        }
      })

    // if (
    //   featuresSettings.isCityWise == true &&
    //   featuresSettings.isServiceAvailable == true &&
    //   localStorage.getItem("userType") == "superadmin"
    // )
    //   this.showCity = true;
    // else this.showCity = false;
  }

  logDate(msg) {
    this.dateObj["list"] = this.datePipe.transform(
      msg,
      "yyyy-MM-dd"
    );
    this.dispChart();
  }

  dispChart() {
    if (this.type === "week") {
      this.months = [];
      this.total = [];
      this.onlinePay = [];
      this.cash = [];
      this.damt = [];
      this.gamt = [];
      this.months = [
        this.translateService.instant("WEEKS.SUNDAY"),
        this.translateService.instant("WEEKS.MONDAY"),
        this.translateService.instant("WEEKS.TUESDAY"),
        this.translateService.instant("WEEKS.WEDNESDAY"),
        this.translateService.instant("WEEKS.THURSDAY"),
        this.translateService.instant("WEEKS.FRIDAY"),
        this.translateService.instant("WEEKS.SATURDAY"),
      ];
      let startDate = moment(this.dateObj["list"])
        .startOf(this.type)
        .format("YYYY-MM-DD");
      const endDate = moment(this.dateObj["list"])
        .endOf(this.type)
        .format("YYYY-MM-DD");
      for (let i = 0; i < 7; i++) {
        this.months[i] = this.months[i] + " (" + startDate + ")";
        this.total[i] = 0;
        this.onlinePay[i] = 0;
        this.cash[i] = 0;
        this.damt[i] = 0;
        this.gamt[i] = 0;
        startDate = moment(startDate).add(1, "d").format("YYYY-MM-DD");
      }
      this.apiservice.CommonGetApi('common/report/siteStatistics/tripReport?dateRange=' + this.type + '&date=' + this.dateObj["list"] + '&scity_like=' + this.city)
        .subscribe({
          next: (res) => {
            this.vals = res.data.tripReport;
            for (const value of this.vals) {
              this.total[moment(value.date).format("d")] = value.totalAmount;
              this.onlinePay[moment(value.date).format("d")] = value.online;
              this.cash[moment(value.date).format("d")] = value.offline;
              this.damt[moment(value.date).format("d")] = value.partner;
              this.gamt[moment(value.date).format("d")] = value.admin;
            }
            setTimeout(() => {
              this.ngAfterViewInit();
            }, 1);
          },
        });
    } else if (this.type === "month") {
      const daysCount = moment(this.dateObj["list"]).daysInMonth();
      this.getMonthName = moment(this.dateObj["list"]).format("MMMM YYYY");
      this.months = [];
      this.total = [];
      this.onlinePay = [];
      this.cash = [];
      this.damt = [];
      this.gamt = [];
      for (let i = 0; i < daysCount; i++) {
        this.months.push((i + 1).toString());
        this.total[i] = 0;
        this.onlinePay[i] = 0;
        this.cash[i] = 0;
        this.damt[i] = 0;
        this.gamt[i] = 0;
      }
      this.apiservice.CommonGetApi('common/report/siteStatistics/tripReport?dateRange=' + this.type + '&date=' + this.dateObj["list"] + '&scity_like=' + this.city)
        .subscribe({
          next: (res) => {
            this.vals = res.data.tripReport;
            for (const value of this.vals) {
              this.total[value._id - 1] = value.totalAmount;
              this.onlinePay[value._id - 1] = value.online;
              this.cash[value._id - 1] = value.offline;
              this.damt[value._id - 1] = value.partner;
              this.gamt[value._id - 1] = value.admin;
            }
            setTimeout(() => {
              this.ngAfterViewInit();
            }, 1);
          },
        });
    } else if (this.type === "year") {
      const getYear = moment(this.dateObj["list"]).year();
      this.months = [];
      this.total = [];
      this.onlinePay = [];
      this.cash = [];
      this.damt = [];
      this.gamt = [];
      this.months = [
        this.translateService.instant("MONTHS.JAN"),
        this.translateService.instant("MONTHS.FEB"),
        this.translateService.instant("MONTHS.MAR"),
        this.translateService.instant("MONTHS.APR"),
        this.translateService.instant("MONTHS.MAY"),
        this.translateService.instant("MONTHS.JUN"),
        this.translateService.instant("MONTHS.JUL"),
        this.translateService.instant("MONTHS.AUG"),
        this.translateService.instant("MONTHS.SEP"),
        this.translateService.instant("MONTHS.OCT"),
        this.translateService.instant("MONTHS.NOV"),
        this.translateService.instant("MONTHS.DEC"),
      ];
      for (let i = 0; i < 12; i++) {
        this.months[i] = this.months[i] + " " + getYear;
        this.total[i] = 0;
        this.onlinePay[i] = 0;
        this.cash[i] = 0;
        this.damt[i] = 0;
        this.gamt[i] = 0;
      }
      this.apiservice.CommonGetApi('common/report/siteStatistics/tripReport?dateRange=' + this.type + '&date=' + this.dateObj["list"] + '&scity_like=' + this.city)
        .subscribe({
          next: (res) => {
            this.vals = res.data.tripReport;
            for (const value of this.vals) {
              this.total[value._id - 1] = value.totalAmount;
              this.onlinePay[value._id - 1] = value.online;
              this.cash[value._id - 1] = value.offline;
              this.damt[value._id - 1] = value.partner;
              this.gamt[value._id - 1] = value.admin;
            }
            setTimeout(() => {
              this.ngAfterViewInit();
            }, 1);
          },
        });
    }
  }

  ngAfterViewInit() {
    this.themeSubscription = this.theme.getJsTheme().subscribe((config) => {
      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;
      this.options = {
        backgroundColor: echarts.bg,
        color: [
          colors.warningLight,
          colors.infoLight,
          colors.dangerLight,
          colors.successLight,
          colors.primaryLight,
        ],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: echarts.tooltipBackgroundColor,
            },
          },
        },
        legend: {
          data: [
            this.translateService.instant("SITESTATISTICS.GENERATECOMMISION"),
            this.translateService.instant("SITESTATISTICS.ONLINEPAYMENT"),
            this.translateService.instant("SITESTATISTICS.PAIDBYDASH"),
            this.translateService.instant("SITESTATISTICS.DRIVERAMOUNT"),
            this.translateService.instant("SITESTATISTICS.TOTAL"),
          ],
          textStyle: {
            color: echarts.textColor,
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: this.months,

            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            splitLine: {
              lineStyle: {
                color: echarts.splitLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        series: [
          {
            name: this.translateService.instant("SITESTATISTICS.GENERATECOMMISION"),
            type: "line",
            stack: "Total amount",
            areaStyle: { normal: { opacity: echarts.areaOpacity } },
            data: this.gamt,
          },
          {
            name: this.translateService.instant("SITESTATISTICS.ONLINEPAYMENT"),
            type: "line",
            stack: "Total amount",
            areaStyle: { normal: { opacity: echarts.areaOpacity } },
            data: this.onlinePay,
          },
          {
            name: this.translateService.instant("SITESTATISTICS.PAIDBYDASH"),
            type: "line",
            stack: "Total amount",
            areaStyle: { normal: { opacity: echarts.areaOpacity } },
            data: this.cash,
          },
          {
            name: this.translateService.instant("SITESTATISTICS.DRIVERAMOUNT"),
            type: "line",
            stack: "Total amount",
            areaStyle: { normal: { opacity: echarts.areaOpacity } },
            data: this.damt,
          },
          {
            name: this.translateService.instant("SITESTATISTICS.TOTAL"),
            type: "line",
            stack: "Total amount",
            label: {
              normal: {
                show: true,
                position: "top",
                textStyle: {
                  color: echarts.textColor,
                },
              },
            },
            areaStyle: { normal: { opacity: echarts.areaOpacity } },
            data: this.total,
          },
        ],
      };
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
