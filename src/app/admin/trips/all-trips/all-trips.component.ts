import { Component, OnInit } from "@angular/core";
import {
  featuresSettings,
  environment,
  CommonData,
} from "../../../../environments/environment";
import { ServerDataSource } from "ng2-smart-table";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { DataService } from "../../data.service";
import { DatePickerComponent } from "../../date-picker/date-picker.component";
import { ApiService } from "../../api.service";
import { NgSelectComponent } from "../../ng-select/ng-select.component";
import { CustomFilterComponent } from "../../custom-filter/custom-filter.component";
import { TranslateService } from "@ngx-translate/core";
import { PagestateService } from "../../pagestate.service";

@Component({
  selector: "ngx-all-trips",
  templateUrl: "./all-trips.component.html",
  styleUrls: ["./all-trips.component.scss"],
})
export class AllTripsComponent implements OnInit {
  currentPage: number;

  pageNum: any = 1;
  settings = {
    // hideSubHeader: !this.filterData,
    // actions: {
    //   edit: false,
    //   delete: false,
    //   add: false,
    //   custom: [{ name: "routeToAPage", title: `<i class="nb-edit"></i>` }],
    // },
    pager: {
      display: true,
      perPage: 10,
      page: this.pageNum,
    },
    mode: "external",

    add: {
      addButtonContent: '<i class="nb-plus"></i>',
    },
    edit: {
      editButtonContent: '<i class="fa fa-edit table-edit-icon"></i>',
    },
    actions: { delete: false, add: false },
    columns: {
      module: {
        title: this.translateService.instant("COMMON.TRIPTYPE"),
        filter: {
          type: 'custom',
          component: CustomFilterComponent,
        },
      },
      referenceNo: {
        title: this.translateService.instant("COMMON.TRIPNO"),
        filter: {
          type: 'custom',
          component: CustomFilterComponent,
        },
      },
      scheduleOn: {
        title: this.translateService.instant("COMMON.DATE"),
        valuePrepareFunction: (scheduleOn) => {
          if (scheduleOn) {
            return moment(scheduleOn)
              .utc()
              .format(featuresSettings.DateFormatWithTime);
          } else return "";
        },
        filter: {
          type: "custom",
          component: DatePickerComponent,
        },
      },
      "partner.name": {
        title: this.translateService.instant("COMMON.PARTNERNAME"),
        filter: {
          type: 'custom',
          component: CustomFilterComponent,
        },

        valuePrepareFunction: (cell, row) => {
          return row.partner.name ? row.partner.name : "N/A";
        },
      },
      "customer.name": {
        title: this.translateService.instant("COMMON.CUSTOMERNAME"),
        filter: {
          type: 'custom',
          component: CustomFilterComponent,
        },
        valuePrepareFunction: (cell, row) => {
          return row.customer.name ? row.customer.name : "N/A";
        },
      },
      fare: {
        title: this.translateService.instant("COMMON.FARE"),
        filter: {
          type: 'custom',
          component: CustomFilterComponent,
        },
        valuePrepareFunction: (cell, row) => {
          if (row.status != "Finished") {
            return row.estimation.totalFare ? row.estimation.totalFare : "N/A";
          } else {
            return row.invoice.totalFare ? row.invoice.totalFare : "N/A";
          }
        },
      },
      serviceTypeName: {
        title: this.translateService.instant("COMMON.VEHICELTYPE"),
        filter: {
          type: 'custom',
          component: CustomFilterComponent,
        },
      },
      // isProfileImgMatchVerified: {
      //   title: "face Recogination",
      //   filter: true,

      //   valuePrepareFunction: (cell, row) => {
      //     if (
      //       row.isProfileImgMatchVerified == true ||
      //       row.isProfileImgMatchVerified == "true"
      //     )
      //       return "Verified";
      //     else return "Not Verified";
      //   },
      // },
      status: {
        title: this.translateService.instant("COMMON.TRIPSTATUS"),
        width: "13%",
        filter: {
          type: "custom",
          component: NgSelectComponent,
          config: {
            options: CommonData.tripsStatus
          }
        },
      },
      paymentMethod: {
        title: this.translateService.instant("COMMON.PAYMENTMODE"),
        filter: {
          type: "custom",
          component: NgSelectComponent,
          config: {
            options: CommonData.paymentMode
          }
        },
      },
    },
  };

  source: ServerDataSource;
  ng2SmartTableFilterParams: any;

  constructor(
    public http: HttpClient,
    private dataService: DataService,
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    private pageStateService: PagestateService,
    private apiservice: ApiService,
    private translateService: TranslateService,
  ) {
    Object.keys(this.settings.columns).forEach(key => {
      this.settings.columns[key].sort = featuresSettings.TableSort;
    });
  }

  onEdit(event) {
    this.router.navigate([
      "admin/trips/invoice-details",
      { id: event._id, page: this.currentPage },
    ]);
    console.log(event)
    this.dataService.setNewRowInfo(event);
  }

  ngOnInit(): void {
    this.pageNum =
      +this.ActivatedRoute.snapshot.queryParamMap.get("page") ||
      this.pageStateService.getPage();
    this.initialTableDataRender();
  }
  initialTableDataRender(): void {
    this.settings.pager.page = this.pageNum;

    this.source = new ServerDataSource(this.http, {
      endPoint: environment.API_ENDPOINT + "services/request/adminHistory",
      dataKey: "data.history",
      pagerPageKey: "page",
      pagerLimitKey: "limit",
      totalKey: "data.total",
      filterFieldKey: "#field#",
    });
    this.source.setPage(this.pageNum, false);
    if (this.ActivatedRoute.snapshot.queryParams.filter) {
      this.source.setFilter(
        JSON.parse(this.ActivatedRoute.snapshot.queryParams.filter),
        true,
        false
      );
    }
    this.pageStateService.serverSource = this.source;
    this.source.onChanged().subscribe((change) => {
      this.pageStateService.handlePageChange(change, this.ActivatedRoute);
    });
  }

  downloadExcel(): void {
    let queryParams = "";
    if (this.ng2SmartTableFilterParams.length > 0) {
      queryParams =
        "?" +
        this.ng2SmartTableFilterParams
          .map((item) => `${item.field}=${item.search}`)
          .join("&");
    }
    this.apiservice.downloadExcelFile(
      "common/report/trip" + queryParams,
      "Trip-Report.xlsx"
    );
  }
}
