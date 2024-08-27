import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NbThemeService, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { ApiService } from '../../api.service';

@Component({
  selector: 'ngx-electricity',
  templateUrl: './electricity.component.html',
  styleUrls: ['./electricity.component.scss']
})
export class ElectricityComponent implements OnInit {
  data: any = [];
  n: any;
  r: any;
  c: any;
  temp: any = [];

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
  type: any = 'year'
  dateObj = {};
  list = new Date();
  label: any;
  currentTheme: string;
  themeSubscription: any;
  startWeekDate: string;
  getMonthName: string;
  endWeekDate: string;
  changePeriod(period: any): void {
    console.log(period)
    this.type = period;
    this.dispChart();
  }

  logDate(msg) {
    this.dateObj["list"] = this.datePipe.transform(msg, 'yyyy-MM-dd');
    this.dispChart();
  }

 
  constructor(
    private themeService: NbThemeService,
    private apiservice: ApiService,
    private translateService: TranslateService,
    private toasterService: NbToastrService,
    private datePipe: DatePipe,) {
    this.dateObj['list'] = this.datePipe.transform(this.list, 'yyyy-MM-dd');
    this.changePeriod('year')
    this.dispChart();
   }

  ngOnInit(): void {
  }
  dispChart() {
    console.log("apii hit")
    this.n = '';
    this.data = [];
    this.startWeekDate = '';
    this.endWeekDate = '';
    this.label = '';
    this.getMonthName = '';
    if (this.type === 'week') {
      this.n = moment(this.dateObj['list']).year();
      this.data = [
        {
          title: this.n,
          months: [
            { month: this.translateService.instant("WEEKS.SUNDAY"), kWatts: 0, cost: 0 },
            { month: this.translateService.instant("WEEKS.MONDAY"), kWatts: 0, cost: 0 },
            { month: this.translateService.instant("WEEKS.TUESDAY"), kWatts: 0, cost: 0 },
            { month: this.translateService.instant("WEEKS.WEDNESDAY"), kWatts: 0, cost: 0 },
            { month: this.translateService.instant("WEEKS.THURSDAY"), kWatts: 0, cost: 0 },
            { month: this.translateService.instant("WEEKS.FRIDAY"), kWatts: 0, cost: 0 },
            { month: this.translateService.instant("WEEKS.SATURDAY"), kWatts: 0, cost: 0 },
          ],
        },
      ];
      this.startWeekDate = moment(this.dateObj['list']).startOf(this.type).format('YYYY-MM-DD');
      this.endWeekDate = moment(this.dateObj['list']).endOf(this.type).format('YYYY-MM-DD');
      this.apiservice.CommonGetApi("common/report/dashboard/tripReport?dateRange="+this.type + '&date='+this.dateObj['list']).subscribe({
        next: (res) => {
          let tripreport = res.data.tripReport
          for (const tripreportarr of tripreport) {
            this.data[0].months[moment(tripreportarr.date).format('d')].kWatts = tripreportarr.count;
          }
          for (const valarr of tripreport) {
            if (valarr.value.length > 0) {
              this.temp = valarr.value[0];
              this.data[0].months[moment(valarr.date).format('d')].cost = this.temp.count;
            }
          }
        },
        // error: (error) => {
        //   this.toasterService.danger(error.error.message);
        // },
      })
    } else if (this.type === 'month') {
      const daysCount = moment(this.dateObj['list']).daysInMonth();
      this.getMonthName = moment(this.dateObj['list']).format('MMMM');
      this.n = moment(this.dateObj['list']).year();
      this.label = moment(this.dateObj['list']).format('MMMM YYYY');
      this.data = [];
      this.data = [
        {
          title: this.n,
          months: [],
        },
      ];
      for (let i = 0; i < daysCount; i++) {
        this.data[0].months.push({ month: this.getMonthName + ' ' + (i + 1).toString(), kWatts: 0, cost: 0 });
      }
      this.apiservice.CommonGetApi("common/report/dashboard/tripReport?dateRange="+this.type + '&date='+this.dateObj['list']).subscribe({
        next: (res) => {
          let tripreport = res.data.tripReport
          for (const tripreportarr of tripreport) {
            this.data[0].months[tripreportarr._id - 1].kWatts = tripreportarr.count;
          }
          for (const valarr of tripreport) {
            if (valarr.value.length > 0) {
              this.temp = valarr.value[0];
              this.data[0].months[valarr._id - 1].cost = this.temp.count;
            }
          }
        },
        // error: (error) => {
        //   this.toasterService.danger(error.error.message);
        // },
      })
    } else if (this.type === 'year') {
      const getYear = moment(this.dateObj['list']).year();
      this.n = getYear;
      this.label = this.n;
      this.data = [
        {
          title: this.n,
          months: [
            { month: this.translateService.instant("MONTHS.JAN"), kWatts: 0, cost: 0 },
            { month: this.translateService.instant("MONTHS.FEB"), kWatts: 0, cost: 0 },
            { month: this.translateService.instant("MONTHS.MAR"), kWatts: 0, cost: 0 },
            { month: this.translateService.instant("MONTHS.APR"), kWatts: 0, cost: 0 },
            { month: this.translateService.instant("MONTHS.MAY"), kWatts: 0, cost: 0 },
            { month: this.translateService.instant("MONTHS.JUN"), kWatts: 0, cost: 0 },
            { month: this.translateService.instant("MONTHS.JUL"), kWatts: 0, cost: 0 },
            { month: this.translateService.instant("MONTHS.AUG"), kWatts: 0, cost: 0 },
            { month: this.translateService.instant("MONTHS.SEP"), kWatts: 0, cost: 0 },
            { month: this.translateService.instant("MONTHS.OCT"), kWatts: 0, cost: 0 },
            { month: this.translateService.instant("MONTHS.NOV"), kWatts: 0, cost: 0 },
            { month: this.translateService.instant("MONTHS.DEC"), kWatts: 0, cost: 0 },
          ],
        },
      ];
      this.apiservice.CommonGetApi("common/report/dashboard/tripReport?dateRange="+this.type + '&date='+this.dateObj['list']).subscribe({
        next: (res) => {
          let tripreport = res.data.tripReport
          for (const tripreportarr of tripreport) {
            this.data[0].months[tripreportarr._id - 1].kWatts = tripreportarr.count;
          }
          for (const valarr of tripreport) {
            if (valarr.value.length > 0) {
              this.temp = valarr.value[0];
              this.data[0].months[valarr._id - 1].cost = this.temp.count;
            }
          }
        },
        // error: (error) => {
        //   this.toasterService.danger(error.error.message);
        // },
      })
    }
    this.themeSubscription = this.themeService.getJsTheme().subscribe(theme => {
      this.currentTheme = theme.name;
    });
  }

}
