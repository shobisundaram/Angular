import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ServerDataSource } from "ng2-smart-table";
import {
  CommonData,
  environment,
  featuresSettings,
} from "../../../../../environments/environment";
import { DataService } from "../../../data.service";
import { TranslateService } from "@ngx-translate/core";
import { NgSelectComponent } from "../../../ng-select/ng-select.component";
import { CustomFilterComponent } from "../../../custom-filter/custom-filter.component";
import { PagestateService } from "../../../pagestate.service";

@Component({
  selector: "ngx-view-service-available-citys",
  templateUrl: "./view-service-available-citys.component.html",
  styleUrls: ["./view-service-available-citys.component.scss"],
})
export class ViewServiceAvailableCitysComponent implements OnInit {
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
      //or something
      // child: {
      //   title: this.translateService.instant("NEARBYCITY.ADDNEARBYCITY"),
      //   type: "html",
      //   filter: false,
      //   valuePrepareFunction: (cell, row) => {
      //     if (row.city === "Default") {
      //     } else {
      //       return `<i class="ion-plus-round"></i></a>`;
      //       // <a title="nearbycities"  href="#/admin/tables/settings/nearbycities;cityId=${row._id};stateId=${row.stateId}" >
      //     }
      //   },
      // },
      name: {
        title: this.translateService.instant("COMMON.CITY"),
        type: "string",
        filter: {
          type: 'custom',
          component: CustomFilterComponent,
        },
      },
      // code: {
      //   title: this.translateService.instant("COMMON.CURRENCY"),
      //   type: "string",
      // },
      status: {
        title: this.translateService.instant("COMMON.STATUS"),
        filter: {
          type: "custom",
          component: NgSelectComponent,
          config: {
            options: CommonData.activeInactive
          }
        },
        valuePrepareFunction: (status) => {
          return status == true ? "Active" : "In Active";
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
      endPoint: environment.API_ENDPOINT + "creteria/serviceArea",
      dataKey: "data.serviceZone",
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
    this.router.navigateByUrl(
      "admin/services/add-edit-service-available-citys"
    );
    this.dataService.setNewRowInfo({});
  }

  onEdit(event) {
    this.router.navigate([
      "admin/services/add-edit-service-available-citys",
      { id: event._id, page: this.currentPage },
    ]);
    this.dataService.setNewRowInfo(event);
  }
}
