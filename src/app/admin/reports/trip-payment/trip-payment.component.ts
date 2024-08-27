import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ServerDataSource } from "ng2-smart-table";
import {
  CommonData,
  environment,
  featuresSettings,
} from "../../../../environments/environment";
import * as moment from "moment";
import { DatePickerComponent } from "../../date-picker/date-picker.component";
import { ApiService } from "../../api.service";
import { NgSelectComponent } from "../../ng-select/ng-select.component";
import { DataService } from "../../data.service";
import { CustomFilterComponent } from "../../custom-filter/custom-filter.component";
import { TranslateService } from "@ngx-translate/core";
import { PagestateService } from "../../pagestate.service";

@Component({
  selector: "ngx-trip-payment",
  templateUrl: "./trip-payment.component.html",
  styleUrls: ["./trip-payment.component.scss"],
})
export class TripPaymentComponent implements OnInit {
  currentPage: any;
  pageNum: any = 1;
  settings = {
    pager: {
      display: true,
      perPage: 10,
      page: this.pageNum,
    },
    mode: "external",
    actions: { delete: false, edit: false, add: false },
    columns: {
      referenceNo: {
        title: this.translateService.instant("COMMON.TRIPNO"),
        filter: {
          type: 'custom',
          component: CustomFilterComponent,
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
      updatedAt: {
        title: this.translateService.instant("COMMON.DATE"),
        valuePrepareFunction: (scheduleOn) => {
          if (scheduleOn) {
            return moment(scheduleOn).format(featuresSettings.DateFormatWithTime);
          } else return "";
        },
        filter: {
          type: "custom",
          component: DatePickerComponent,
        },
      },

      "invoice.actualFare": {
        title: this.translateService.instant("ESTIMATION.ACTUAL_FARE"),
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return row.invoice.actualFare ? row.invoice.actualFare : "0";
        },
      },
      "invoice.roundOff": {
        title: this.translateService.instant("ESTIMATION.ROUND_OFF"),
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return row.invoice.roundOff ? row.invoice.roundOff : "0";
        },
      },
      "invoice.totalFare": {
        title: this.translateService.instant("ESTIMATION.TOTAL_FARE"),
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return row.invoice.totalFare ? row.invoice.totalFare : "0";
        },
      },
      "invoice.bookingFare": {
        title: this.translateService.instant("ESTIMATION.BOOKING_FARE"),
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return row.invoice.bookingFare ? row.invoice.bookingFare : "0";
        },
      },
      "invoice.discountFare": {
        title: this.translateService.instant("ESTIMATION.DISCOUNT"),
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return row.invoice.discountFare ? row.invoice.discountFare : "0";
        },
      },
      "invoice.payable": {
        title: this.translateService.instant("ESTIMATION.PARTNER_EARNED"),
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return row.invoice.payable ? row.invoice.payable : "0";
        },
      },
      "invoice.taxFare": {
        title: this.translateService.instant("ESTIMATION.TAX"),
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return row.invoice.taxFare ? row.invoice.taxFare : "0";
        },
      },
      "invoice.commision": {
        title: this.translateService.instant("ESTIMATION.DEDUCTED_FARE"),
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return row.invoice.commision ? row.invoice.commision : "0";
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
  baseurl = environment.BASEURL;
  source: ServerDataSource;
  ng2SmartTableFilterParams: any;
  allData: number;
  perPageData: number;
  totalPages: number;

  constructor(
    private router: Router,
    private http: HttpClient,
    private ActivatedRoute: ActivatedRoute,
    private apiservice: ApiService,
    private translateService: TranslateService,
    private pageStateService: PagestateService,
    private dataService: DataService
  ) {
    Object.keys(this.settings.columns).forEach(key => {
      this.settings.columns[key].sort = featuresSettings.TableSort;
    });
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
      endPoint:
        environment.API_ENDPOINT +
        "services/request/adminHistory?status=Finished",
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
        "?status=Finished&" +
        this.ng2SmartTableFilterParams
          .map((item) => `${item.field}=${item.search}`)
          .join("&");
    }
    this.apiservice.downloadExcelFile(
      "common/report/trippayment" + queryParams,
      "Trip Payment-Report.xlsx"
    );
  }
}
