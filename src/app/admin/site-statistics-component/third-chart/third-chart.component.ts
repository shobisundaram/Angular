import { Component, OnInit } from '@angular/core';
import { NbThemeService, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { featuresSettings } from '../../../../environments/environment';
import { ApiService } from '../../api.service';
import { DataService } from '../../data.service';

@Component({
  selector: 'ngx-third-chart',
  templateUrl: './third-chart.component.html',
  styleUrls: ['./third-chart.component.scss']
})
export class ThirdChartComponent implements OnInit {
  options: any = {};
  themeSubscription: any;
  months:any;
  coA:number[]=new Array(12);
  vals:any;  
  city : string = "Service Available City"
  SerivceCity: any;
  showCity: boolean;
  constructor(private theme: NbThemeService,
    private dataService: DataService,
    private toasterService: NbToastrService,
    private translateService: TranslateService,
    private _service : ApiService) { 
      for(let i=0;i<12;i++)
      {
        this.coA[i]=0;
      }
    this.months=[
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
    this.changeCity(this.city);
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

    if (featuresSettings.isCityWise == true && featuresSettings.isServiceAvailable == true )
    this.showCity = true;
    else this.showCity = false;
  }

  ngOnInit(): void {
  }
  changeCity(data) {
    this.city = data;
    if(data == 'Service Available City' || data == 'all' ){
      this._service.CommonGetApi('common/report/siteStatistics/customerCount?dateRange=year')
      .subscribe({
        next: (res) => {
          this.vals= res.data.customerCount ;
          for (var value of this.vals) {
           this.coA[value._id-1]=value.count;  
          }   
          this.ngAfterViewInit();
        },
        error: (error) => {
          this.toasterService.danger(error.error.message);
        },
      })
    }else if(data){
      this._service.CommonGetApi('common/report/siteStatistics?scity_like='+ data)
      .subscribe({
        next: (res) => {
          this.vals= res.data.customerCount ;
          for (var value of this.vals) {
           this.coA[value._id-1]=value.count;  
          }   
          this.ngAfterViewInit();
        },
        error: (error) => {
          this.toasterService.danger(error.error.message);
        },
      })
    }

    // this.chartService.getCounts(data)
    // .then((val: Object[]) => { 
    //   this.vals=val;
    //   for (var value of this.vals) {
    //    this.coA[value._id-1]=value.count;  
    //   }   this.ngAfterViewInit();
    // }); 
  }
  ngAfterViewInit() { 
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;

      this.options = {
        backgroundColor: echarts.bg,
        color: [colors.primaryLight],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: this.months, //['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
            type: 'value',
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
            name: 'Nos',
            type: 'bar',
            barWidth: '60%',
            data:this.coA, // [10, 52, 200, 334, 390, 330, 220],
          },
        ],
      };
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
