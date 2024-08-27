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
import { CustomFilterComponent } from "../../../custom-filter/custom-filter.component";
import { PagestateService } from "../../../pagestate.service";

@Component({
  selector: "ngx-view-admin-group",
  templateUrl: "./view-admin-group.component.html",
  styleUrls: ["./view-admin-group.component.scss"],
})
export class ViewAdminGroupComponent implements OnInit {
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
      group: {
        title: this.translateService.instant("ADMINGROUP.GROUP"),
        type: "string",
        filter: {
          type: 'custom',
          component: CustomFilterComponent,
        },
      },
      description: {
        title: this.translateService.instant("ADMINGROUP.DESCRIPTION"),
        type: "string",
        filter: {
          type: 'custom',
          component: CustomFilterComponent,
        },
      },
      // permission: {
      //   title: this.translateService.instant("ADMINGROUP.MENUS"),
      //   valuePrepareFunction: (permission) => {
      //     let formattedPermissions = "";
      //     // Assuming permissions is an array of objects with 'menu' property
      //     for (let i = 0; i < permission.length; i++) {
      //       formattedPermissions += permission[i].menu;
      //       // Add a comma if it's not the last item
      //       if (i < permission.length - 1) {
      //         formattedPermissions += ", ";
      //       }
      //     }
      //     return formattedPermissions;
      //   },
      // },
    },
  };
  baseurl = environment.BASEURL;
  source: ServerDataSource;

  constructor(
    private router: Router,
    private dataService: DataService,
    private http: HttpClient,
    private pageStateService: PagestateService,
    private translateService: TranslateService,
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
      endPoint: environment.API_ENDPOINT + "common/adminGroup",
      dataKey: "data.adminGroup",
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
    this.router.navigateByUrl("admin/utility/add-edit-amdin-group");
    this.dataService.setNewRowInfo({});
  }

  onEdit(event) {
    this.router.navigate([
      "admin/utility/add-edit-amdin-group",
      { id: event._id, page: this.currentPage },
    ]);
    this.dataService.setNewRowInfo(event);
  }
}
