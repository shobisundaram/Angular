import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LocalDataSource, ServerDataSource } from "ng2-smart-table";
import {
  environment,
  featuresSettings,
} from "../../../../environments/environment";
import { DataService } from "../../data.service";
import { TranslateService } from "@ngx-translate/core";
import * as moment from "moment";
import { DatePipe } from "@angular/common";
import { DatePickerComponent } from "../../date-picker/date-picker.component";
import { CustomFilterComponent } from "../../custom-filter/custom-filter.component";
import { PagestateService } from "../../pagestate.service";

@Component({
  selector: "ngx-view-promotions",
  templateUrl: "./view-promotions.component.html",
  styleUrls: ["./view-promotions.component.scss"],
})
export class ViewPromotionsComponent implements OnInit {
  pageNum: any = 1;
  currentPage: number;
  settings = {
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
    actions: { delete: false },
    columns: {
      code: {
        title: this.translateService.instant("COMMON.COUPONCODE"),
        type: "string",
        filter: {
          type: 'custom',
          component: CustomFilterComponent,
        },
      },
      start: {
        title: this.translateService.instant("COMMON.ACTIVATION_DATE"),
        type: "string",
        valuePrepareFunction: (start) => {
          if (start) {
            return moment(start).format(featuresSettings.DateFormat);
          } else return "";
        },
        filter: {
          type: "custom",
          component: DatePickerComponent,
        },
      },
      end: {
        title: this.translateService.instant("COMMON.EXPIRY_DATE"),
        type: "string",
        valuePrepareFunction: (end) => {
          if (end) {
            return moment(end).format(featuresSettings.DateFormat);
          } else return "";
        },
        filter: {
          type: "custom",
          component: DatePickerComponent,
        },
      },
      startTime: {
        title: this.translateService.instant("COMMON.START_TIME"),
        filter: false,
        type: "string",
        valuePrepareFunction: (startTime) => {
          if (startTime) {
            const today = new Date();
            const [hours, minutes] = startTime.split(":");
            today.setHours(+hours, +minutes, 0, 0);
            const convertedTime = this.datePipe.transform(
              today,
              "YYYY-MM-ddTHH:mm:ss.SSS"
            );
            return moment(convertedTime).format(featuresSettings.TimeFormat);
          } else return "";
        },
      },
      endTime: {
        title: this.translateService.instant("COMMON.END_TIME"),
        filter: false,
        type: "string",
        valuePrepareFunction: (endTime) => {
          if (endTime) {
            const today = new Date();
            const [hours, minutes] = endTime.split(":");
            today.setHours(+hours, +minutes, 0, 0);
            const convertedTime = this.datePipe.transform(
              today,
              "YYYY-MM-ddTHH:mm:ss.SSS"
            );
            return moment(convertedTime).format(featuresSettings.TimeFormat);
          } else return "";
        },
      },
    },
  };
  baseurl = environment.BASEURL;
  source: ServerDataSource;

  constructor(
    private router: Router,
    private dataService: DataService,
    private http: HttpClient,
    private translateService: TranslateService,
    private pageStateService: PagestateService,
    private ActivatedRoute: ActivatedRoute,
    private datePipe: DatePipe
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
      endPoint: environment.API_ENDPOINT + "creteria/coupon",
      dataKey: "data.coupons",
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

  onAdd(event: Event) {
    this.router.navigateByUrl("admin/coupons/add-edit-coupons");
    this.dataService.setNewRowInfo({});
  }

  onEdit(event) {
    this.router.navigate([
      "admin/coupons/add-edit-coupons",
      { id: event._id, page: this.currentPage },
    ]);
    this.dataService.setNewRowInfo(event);
  }

  convertTimeToIsoFormat(timeString) {
    const today = new Date();
    const [hours, minutes] = timeString.split(":");
    today.setHours(+hours, +minutes, 0, 0);
    const convertedTime = this.datePipe.transform(
      today,
      "YYYY-MM-ddTHH:mm:ss.SSS"
    );
    return moment(convertedTime).format(featuresSettings.TimeFormat);
  }
}
