import { Component, OnInit, AfterViewInit, OnDestroy } from "@angular/core";
import { NbThemeService } from "@nebular/theme";
declare const echarts: any;

@Component({
  selector: "ngx-solar-chart-driver",
  templateUrl: "./solar-chart-driver.component.html",
  styleUrls: ["./solar-chart-driver.component.scss"],
})
export class SolarChartDriverComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  value: number = 0;
  out = 0;
  active: any = 0;
  ractive: any = 0;
  avg: number = 0;
  acount: any = [];
  rcount: any = [];
  sum: any = 0;
  temp: number;
  term: number = 0;
  option: any = {};
  themeSubscription: any;

  constructor(private theme: NbThemeService) {
    this.value = 0;
    this.out = 0;

    this.themeSubscription = this.theme.getJsTheme().subscribe((config) => {
      const solarTheme: any = config.variables.solar;

      this.option = Object.assign(
        {},
        {
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)",
          },
          series: [
            {
              name: " ",
              clockWise: true,
              hoverAnimation: false,
              type: "pie",
              center: ["45%", "50%"],
              radius: solarTheme.radius,
              data: [
                {
                  value: this.value,
                  name: " ",
                  label: {
                    normal: {
                      position: "center",
                      formatter: "{d}%",
                      textStyle: {
                        fontSize: "22",
                        fontFamily: config.variables.fontSecondary,
                        fontWeight: "600",
                        color: config.variables.fgHeading,
                      },
                    },
                  },
                  tooltip: {
                    show: false,
                  },
                  itemStyle: {
                    normal: {
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                          offset: 0,
                          color: solarTheme.gradientLeft,
                        },
                        {
                          offset: 1,
                          color: solarTheme.gradientRight,
                        },
                      ]),
                      shadowColor: solarTheme.shadowColor,
                      shadowBlur: 0,
                      shadowOffsetX: 0,
                      shadowOffsetY: 3,
                    },
                  },
                  hoverAnimation: false,
                },
                {
                  value: 100 - this.value,
                  name: " ",
                  tooltip: {
                    show: false,
                  },
                  label: {
                    normal: {
                      position: "inner",
                    },
                  },
                  itemStyle: {
                    normal: {
                      color: config.variables.layoutBg,
                    },
                  },
                },
              ],
            },
            {
              name: " ",
              clockWise: true,
              hoverAnimation: false,
              type: "pie",
              center: ["45%", "50%"],
              radius: solarTheme.radius,
              data: [
                {
                  value: this.value,
                  name: " ",
                  label: {
                    normal: {
                      position: "inner",
                      show: false,
                    },
                  },
                  tooltip: {
                    show: false,
                  },
                  itemStyle: {
                    normal: {
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                          offset: 0,
                          color: solarTheme.gradientLeft,
                        },
                        {
                          offset: 1,
                          color: solarTheme.gradientRight,
                        },
                      ]),
                      shadowColor: solarTheme.shadowColor,
                      shadowBlur: 7,
                    },
                  },
                  hoverAnimation: false,
                },
                {
                  value: 28,
                  name: " ",
                  tooltip: {
                    show: false,
                  },
                  label: {
                    normal: {
                      position: "inner",
                    },
                  },
                  itemStyle: {
                    normal: {
                      color: "none",
                    },
                  },
                },
              ],
            },
          ],
        }
      );
      // console.log(solarTheme)
      // console.log(this.value)
    });
    this.setValueForChart();
  }

  ngOnInit(): void {}

  setValueForChart() {
    // this.apiservice.CommonGetApi("activeUsers").subscribe((users1) => {
    const users = [
      [
        {
          _id: "active",
          count: 55,
        },
        {
          _id: "inactive",
          count: 3,
        },
      ],
      [
        {
          _id: "active",
          count: 80,
        },
        {
          _id: "inactive",
          count: 8,
        },
      ],
    ];
    if (users[0].length === 2) {
      this.active = users[0];
      this.sum = this.active[0].count + this.active[1].count;
      this.avg = (this.active[0].count / this.sum) * 100;
      this.acount = [this.avg.toFixed(0), this.sum.toFixed(0)];
      this.value = this.acount[0];
      this.out = this.acount[1];
      this.term = parseFloat(((this.value * this.out) / 100).toFixed(0));
      // console.log("term",term)
    } else {
      this.active = users[0];
      this.sum = this.active[0].count + 0;
      this.avg = (this.active[0].count / this.sum) * 100;
      this.acount = [this.avg.toFixed(0), this.sum.toFixed(0)];
      this.value = this.acount[0];
      this.out = this.acount[1];
      this.term = parseFloat(((this.value * this.out) / 100).toFixed(0));
      // var term=(this.value*this.out/100).toFixed(0);
    }

    this.themeSubscription = this.theme.getJsTheme().subscribe((config) => {
      const solarTheme: any = config.variables.solar;
      this.option = Object.assign(
        {},
        {
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)",
          },
          series: [
            {
              name: " ",
              clockWise: true,
              hoverAnimation: false,
              type: "pie",
              center: ["45%", "50%"],
              radius: solarTheme.radius,
              data: [
                {
                  value: this.value,
                  name: " ",
                  label: {
                    normal: {
                      position: "center",
                      formatter: "{d}%",
                      textStyle: {
                        fontSize: "22",
                        fontFamily: config.variables.fontSecondary,
                        fontWeight: "600",
                        color: config.variables.fgHeading,
                      },
                    },
                  },
                  tooltip: {
                    show: false,
                  },
                  itemStyle: {
                    normal: {
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                          offset: 0,
                          color: solarTheme.gradientLeft,
                        },
                        {
                          offset: 1,
                          color: solarTheme.gradientRight,
                        },
                      ]),
                      shadowColor: solarTheme.shadowColor,
                      shadowBlur: 0,
                      shadowOffsetX: 0,
                      shadowOffsetY: 3,
                    },
                  },
                  hoverAnimation: false,
                },
                {
                  value: 100 - this.value,
                  name: " ",
                  tooltip: {
                    show: false,
                  },
                  label: {
                    normal: {
                      position: "inner",
                    },
                  },
                  itemStyle: {
                    normal: {
                      color: config.variables.layoutBg,
                    },
                  },
                },
              ],
            },
            {
              name: " ",
              clockWise: true,
              hoverAnimation: false,
              type: "pie",
              center: ["45%", "50%"],
              radius: solarTheme.radius,
              data: [
                {
                  value: this.value,
                  name: " ",
                  label: {
                    normal: {
                      position: "inner",
                      show: false,
                    },
                  },
                  tooltip: {
                    show: false,
                  },
                  itemStyle: {
                    normal: {
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                          offset: 0,
                          color: solarTheme.gradientLeft,
                        },
                        {
                          offset: 1,
                          color: solarTheme.gradientRight,
                        },
                      ]),
                      shadowColor: solarTheme.shadowColor,
                      shadowBlur: 7,
                    },
                  },
                  hoverAnimation: false,
                },
                {
                  value: 28,
                  name: " ",
                  tooltip: {
                    show: false,
                  },
                  label: {
                    normal: {
                      position: "inner",
                    },
                  },
                  itemStyle: {
                    normal: {
                      color: "none",
                    },
                  },
                },
              ],
            },
          ],
        }
      );
      // console.log(solarTheme)
      // console.log(this.value)
    });
    // }); // if(users[1].length==2){
    //       this.ractive=users[1];
    //       this.sum=this.ractive[0].count+this.ractive[1].count;
    //       this.avg=(this.ractive[0].count/this.sum)*100;
    // }else{
    //       this.ractive=users[1];
    //      this.sum=this.ractive[0].count+0;
    //      this.avg=(this.ractive[0].count/this.sum)*100;
    //      }
    //     this.rcount= [this.avg, this.sum];
  }

  ngAfterViewInit() {
    this.themeSubscription = this.theme.getJsTheme().subscribe((config) => {
      const solarTheme: any = config.variables.solar;
      this.option = Object.assign(
        {},
        {
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)",
          },
          series: [
            {
              name: " ",
              clockWise: true,
              hoverAnimation: false,
              type: "pie",
              center: ["45%", "50%"],
              radius: solarTheme.radius,
              data: [
                {
                  value: this.value,
                  name: " ",
                  label: {
                    normal: {
                      position: "center",
                      formatter: "{d}%",
                      textStyle: {
                        fontSize: "22",
                        fontFamily: config.variables.fontSecondary,
                        fontWeight: "600",
                        color: config.variables.fgHeading,
                      },
                    },
                  },
                  tooltip: {
                    show: false,
                  },
                  itemStyle: {
                    normal: {
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                          offset: 0,
                          color: solarTheme.gradientLeft,
                        },
                        {
                          offset: 1,
                          color: solarTheme.gradientRight,
                        },
                      ]),
                      shadowColor: solarTheme.shadowColor,
                      shadowBlur: 0,
                      shadowOffsetX: 0,
                      shadowOffsetY: 3,
                    },
                  },
                  hoverAnimation: false,
                },
                {
                  value: 100 - this.value,
                  name: " ",
                  tooltip: {
                    show: false,
                  },
                  label: {
                    normal: {
                      position: "inner",
                    },
                  },
                  itemStyle: {
                    normal: {
                      color: config.variables.layoutBg,
                    },
                  },
                },
              ],
            },
            {
              name: " ",
              clockWise: true,
              hoverAnimation: false,
              type: "pie",
              center: ["45%", "50%"],
              radius: solarTheme.radius,
              data: [
                {
                  value: this.value,
                  name: " ",
                  label: {
                    normal: {
                      position: "inner",
                      show: false,
                    },
                  },
                  tooltip: {
                    show: false,
                  },
                  itemStyle: {
                    normal: {
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                          offset: 0,
                          color: solarTheme.gradientLeft,
                        },
                        {
                          offset: 1,
                          color: solarTheme.gradientRight,
                        },
                      ]),
                      shadowColor: solarTheme.shadowColor,
                      shadowBlur: 7,
                    },
                  },
                  hoverAnimation: false,
                },
                {
                  value: 28,
                  name: " ",
                  tooltip: {
                    show: false,
                  },
                  label: {
                    normal: {
                      position: "inner",
                    },
                  },
                  itemStyle: {
                    normal: {
                      color: "none",
                    },
                  },
                },
              ],
            },
          ],
        }
      );
    });
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
