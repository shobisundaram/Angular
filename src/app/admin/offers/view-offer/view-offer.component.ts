import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ServerDataSource } from "ng2-smart-table";
import {
  environment,
  featuresSettings,
} from "../../../../environments/environment";
import { DataService } from "../../data.service";
import { TranslateService } from "@ngx-translate/core";
import * as moment from "moment";
import { DatePickerComponent } from "../../date-picker/date-picker.component";
import { CustomFilterComponent } from "../../custom-filter/custom-filter.component";
import { PagestateService } from "../../pagestate.service";

@Component({
  selector: "ngx-view-offer",
  templateUrl: "./view-offer.component.html",
  styleUrls: ["./view-offer.component.scss"],
})
export class ViewOfferComponent implements OnInit {
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
      title: {
        title: this.translateService.instant("COMMON.TITLE"),
        type: "string",
        filter: {
          type: 'custom',
          component: CustomFilterComponent,
        },
      },
      start: {
        title: this.translateService.instant("OFFERS.OFFERS_START_DATE"),
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
        title: this.translateService.instant("OFFERS.OFFERS_END_DATE"),
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
      updatedAt: {
        title: this.translateService.instant("COMMON.LAST_UPDATED_TIME"),
        valuePrepareFunction: (updatedAt) => {
          if (updatedAt) {
            return moment(updatedAt).format(
              featuresSettings.DateFormatWithTime
            );
          } else return "";
        },
        filter: {
          type: "custom",
          component: DatePickerComponent,
        },
      },
      // offerImg: {
      //   title: this.translateService.instant("COMMON.IMAGE"),
      //   type: "html",
      //   filter: false,
      //   valuePrepareFunction: (offerImg: string) =>
      //     `<img class="fileImageForng2-table" src="${
      //       this.baseurl + offerImg
      //     }" alt='icon' />`,
      // },
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
    private ActivatedRoute: ActivatedRoute
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
      endPoint: environment.API_ENDPOINT + "creteria/offer",
      dataKey: "data.Offer",
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
    this.router.navigateByUrl("admin/offers/add-edit-offer");
    this.dataService.setNewRowInfo({});
  }

  onEdit(event) {
    this.router.navigate([
      "admin/offers/add-edit-offer",
      { id: event._id, page: this.currentPage },
    ]);
    this.dataService.setNewRowInfo(event);
  }
}
