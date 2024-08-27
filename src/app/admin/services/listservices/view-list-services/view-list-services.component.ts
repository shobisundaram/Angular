import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ServerDataSource } from "ng2-smart-table";
import { environment, featuresSettings } from "../../../../../environments/environment";
import { DataService } from "../../../data.service";
import { TranslateService } from "@ngx-translate/core";
import { CustomFilterComponent } from "../../../custom-filter/custom-filter.component";
import { PagestateService } from "../../../pagestate.service";

@Component({
  selector: "ngx-view-list-services",
  templateUrl: "./view-list-services.component.html",
  styleUrls: ["./view-list-services.component.scss"],
})
export class ViewListServicesComponent implements OnInit {
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
      //   title: this.translateService.instant("SERVICES.ADDDISTANCEFARE"),
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
      order: {
        title: this.translateService.instant("COMMON.DISPLAYORDER"),
        type: "string",
        filter: {
          type: 'custom',
          component: CustomFilterComponent,
        },
      },
      name: {
        title: this.translateService.instant("COMMON.TYPE"),
        type: "string",
        filter: {
          type: 'custom',
          component: CustomFilterComponent,
        },
      },
      types: {
        title: this.translateService.instant("COMMON.TRIPTYPE"),
        type: "string",
        filter: {
          type: 'custom',
          component: CustomFilterComponent,
        },
      },
      seats: {
        title: this.translateService.instant("COMMON.AVAILABLE_SEATS"),
        type: "string",
        filter: {
          type: 'custom',
          component: CustomFilterComponent,
        },
      },
      // image: {
      //   title: this.translateService.instant("COMMON.IMAGE"),
      //   type: "html",
      //   filter: false,
      //   valuePrepareFunction: (image: string) =>
      //     `<img class="fileImageForng2-table" src="${
      //       this.baseurl + image
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
      endPoint: environment.API_ENDPOINT + "creteria/serviceType",
      dataKey: "data.admin",
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
    this.router.navigateByUrl("admin/services/add-edit-list-services");
    this.dataService.setNewRowInfo({});
  }

  onEdit(event) {
    this.router.navigate([
      "admin/services/add-edit-list-services",
      { id: event._id, page: this.currentPage },
    ]);
    this.dataService.setNewRowInfo(event);
  }
}
