import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NbThemeService, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { featuresSettings } from '../../../../environments/environment';
import { ApiService } from '../../api.service';
import { DataService } from '../../data.service';
@Component({
  selector: 'ngx-second-chart',
  templateUrl: './second-chart.component.html',
  styleUrls: ['./second-chart.component.scss']
})
export class SecondChartComponent implements OnInit {
  options: any = {};
  themeSubscription: any;
  @Output() periodChanges = new EventEmitter<string>();
  @Input() periodtype: any = 'year';
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
  list = new Date();
  dateObj = {};
  datas: any = {};
  n1: number = 0;
  n2: number = 0;
  n3: number = 0;
  getMonthName: string;
  city : string ="Service Available City"
  showCity: boolean;
  SerivceCity: any;
  changePeriod(period: any): void {
    this.periodtype = period;
    this.periodChanges.emit(period);
    this.dispChart();
  }
  changeCity(data) {
    this.city = data;
    this.dispChart();
  }

  logDate(msg) {
    this.dateObj["list"] = this.datePipe.transform(msg, 'yyyy-MM-dd');
    this.dispChart();
  }
  constructor(
    private theme: NbThemeService,
    private toasterService: NbToastrService,
    private datePipe: DatePipe,
    private dataService: DataService,
    private translateService: TranslateService,
    private _service: ApiService
  ) { 
    this.dateObj['list'] = this.datePipe.transform(this.list, 'yyyy-MM-dd');
    this.dispChart();
    this.dataService.getNewRowInfo()
    .subscribe((res)=> {
      if (res && res.data) {
      this.SerivceCity = res.data.serviceArea;
      }
    })
    // this._service.CommonGetApi("creteria/serviceArea/list").subscribe({
    //   next: (res) => {
    //     this.SerivceCity = res.data.serviceArea;
    //   },
    //   error: (error) => {
    //     this.toasterService.danger(error.error.message);
    //   },
    // });
    if(featuresSettings.isCityWise == true && featuresSettings.isServiceAvailable == true && localStorage.getItem('userType') == 'superadmin' )
    this.showCity = true;
    else 
    this.showCity = false;
  }

  ngOnInit(): void {
  }
  dispChart() {
    this.datas = '';
    this.n1 = 0;
    this.n2 = 0;
    this.n3 = 0;
    if (this.periodtype === 'week') {
      const startDate = moment(this.dateObj['list']).startOf(this.periodtype).format('YYYY-MM-DD');
      const endDate = moment(this.dateObj['list']).endOf(this.periodtype).format('YYYY-MM-DD');
      this.getMonthName = 'Trip Details' +'\n'+ ' From ' + startDate + '\n' + 'To ' + endDate;
      this.getOptions(this.dateObj['list'], this.periodtype, this.city)
    } else if (this.periodtype === 'month') {
      const getName = moment(this.dateObj['list']).format('MMMM YYYY');
      this.getMonthName = 'Trip Details From ' + getName;
      this.getOptions(this.dateObj['list'], this.periodtype, this.city)
    } else if (this.periodtype === 'year') {
      const getYear = moment(this.dateObj['list']).year();
      this.getMonthName = 'Trip Details in Year ' + getYear;
      this.getOptions(this.dateObj['list'], this.periodtype , this.city)
    }
  }
  getOptions(date: any, status: any,city){
    if(date && status && (city =='Service Available City' || city == 'all')) {
      this._service.CommonGetApi('common/report/siteStatistics/tripCount?dateRange=' + status + '&date=' + date +'&scity_like='+ city)
      .subscribe({
      next: (res) => {
        this.datas = res.data.tripCount;
          this.n2 = this.datas.cancelled;
          this.n3 = this.datas.noResponse;
          this.n1 = this.datas.finished;
          this.ngAfterViewInit();
      },
      error: (error) => {
        this.toasterService.danger(error.error.message);
      },
      })
    }
    else if(date && status && city){
      this._service.CommonGetApi('common/report/siteStatistics/tripCount?dateRange=' + status + '&date=' + date +'&scity_like='+ city)
      .subscribe({
      next: (res) => {
        this.datas = res.data.tripCount;
          this.n2 = this.datas.cancelled;
          this.n3 = this.datas.noResponse;
          this.n1 = this.datas.finished;
          this.ngAfterViewInit();
      },
      error: (error) => {
        this.toasterService.danger(error.error.message);
      },
      })
    }

  }
  ngAfterViewInit() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors = config.variables;
      const echarts: any = config.variables.echarts;

      this.options = {
        backgroundColor: echarts.bg,
        color: [colors.warningLight, colors.infoLight, colors.dangerLight, colors.successLight, colors.primaryLight],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          data: [
            this.translateService.instant("SITESTATISTICS.FINISHED"),
            this.translateService.instant("SITESTATISTICS.CANCELLED"),
            this.translateService.instant("SITESTATISTICS.NORESPONSE"),
          ],
          textStyle: {
            color: echarts.textColor,
          },
        },
        series: [
          {
            name: 'Trips',
            type: 'pie',
            radius: '80%',
            center: ['50%', '50%'],
            data: [
              { value: this.n1, name: this.translateService.instant("SITESTATISTICS.FINISHED") },
              { value: this.n2, name: this.translateService.instant("SITESTATISTICS.CANCELLED") },
              { value: this.n3, name: this.translateService.instant("SITESTATISTICS.NORESPONSE") },
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: echarts.itemHoverShadowColor,
              },
            },
            label: {
              normal: {
                textStyle: {
                  color: echarts.textColor,
                },
              },
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: echarts.axisLineColor,
                },
              },
            },
          },
        ],
      };
    });
  }
  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
