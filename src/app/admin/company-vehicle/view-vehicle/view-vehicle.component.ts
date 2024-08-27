import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ServerDataSource } from "ng2-smart-table";
import {
  environment,
  featuresSettings,
} from "../../../../environments/environment";
import { DataService } from "../../data.service";
import * as moment from "moment";
import { DatePickerComponent } from "../../date-picker/date-picker.component";
import { CustomFilterComponent } from "../../custom-filter/custom-filter.component";
import { TranslateService } from "@ngx-translate/core";
import { PagestateService } from "../../pagestate.service";

@Component({
  selector: "ngx-view-vehicle",
  templateUrl: "./view-vehicle.component.html",
  styleUrls: ["./view-vehicle.component.scss"],
})
export class ViewVehicleComponent implements OnInit {
  currentPage: any;
  pageNum: any = 1;
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
      ownerType: {
        title: this.translate.instant("VEHICLEADD.OWNER_TYPE"),
        filter: {
          type: "custom",
          component: CustomFilterComponent,
        },
      },
      partnername: {
        title: this.translate.instant("COMMON.PARTNERNAME"),
        filter: {
          type: "custom",
          component: CustomFilterComponent,
        },
      },
      makename: {
        title: this.translate.instant("MAKE.MAKE"),
        filter: {
          type: "custom",
          component: CustomFilterComponent,
        },
      },
      modelname: {
        title: this.translate.instant("MODEL.MODEL"),
        filter: {
          type: "custom",
          component: CustomFilterComponent,
        },
      },
      registrationnumber: {
        title: this.translate.instant("COMMON.REG_NO"),
        filter: {
          type: "custom",
          component: CustomFilterComponent,
        },
      },
      updatedAt: {
        title: this.translate.instant("COMMON.LAST_UPDATED_TIME"),
        valuePrepareFunction: (lastUpdate) => {
          if (lastUpdate) {
            return moment(lastUpdate).format(
              featuresSettings.DateFormatWithTime
            );
          } else return "";
        },
        filter: {
          type: "custom",
          component: DatePickerComponent,
        },
      },
      // online: {
      //   title: this.translate.instant("COMMON.ONLINESTATUS"),
      //   valuePrepareFunction: (online) => {
      //     return online == true ? "Online" : "Offline";
      //   },
      // },
      // profile: {
      //   title: "Image",
      //   type: "html",
      //   filter: false,
      //   valuePrepareFunction: (profile: string) =>
      //     `<img class="fileImageForng2-table" src="${this.baseurl + profile}" alt='icon' />`,
      // },
    },
  };
  baseurl = environment.BASEURL;
  source: ServerDataSource;

  constructor(
    private router: Router,
    private dataService: DataService,
    private http: HttpClient,
    private translate: TranslateService,
    private pageStateService: PagestateService,
    private ActivatedRoute: ActivatedRoute
  ) {
    Object.keys(this.settings.columns).forEach((key) => {
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
      endPoint: environment.API_ENDPOINT + "creteria/vehicle",
      dataKey: "data.Vehicle",
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
    this.router.navigateByUrl("admin/company-vehicle/add-edit-vehicle");
    this.dataService.setNewRowInfo({});
  }

  onEdit(event) {
    this.router.navigate([
      "admin/company-vehicle/add-edit-vehicle",
      { id: event._id, page: this.currentPage },
    ]);
    this.dataService.setNewRowInfo(event);
  }
}
