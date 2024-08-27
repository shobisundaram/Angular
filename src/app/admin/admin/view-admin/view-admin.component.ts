import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ServerDataSource } from "ng2-smart-table";
import {
  CommonData,
  environment,
  featuresSettings,
} from "../../../../environments/environment";
import { DataService } from "../../data.service";
import { TranslateService } from "@ngx-translate/core";
import * as moment from "moment";
import { DatePickerComponent } from "../../date-picker/date-picker.component";
import { ApiService } from "../../api.service";
import { NgSelectComponent } from "../../ng-select/ng-select.component";
import { CustomFilterComponent } from "../../custom-filter/custom-filter.component";
import { PagestateService } from "../../pagestate.service";

@Component({
  selector: "ngx-view-admin",
  templateUrl: "./view-admin.component.html",
  styleUrls: ["./view-admin.component.scss"],
})
export class ViewAdminComponent {
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
      // createButtonContent: '<i class="nb-checkmark"></i>',
      // cancelButtonContent: '<i class="nb-close"></i>',
      // confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="fa fa-edit table-edit-icon"></i>',
      // saveButtonContent: '<i class="nb-checkmark"></i>',
      // cancelButtonContent: '<i class="nb-close"></i>',
    },
    // delete: {
    //   deleteButtonContent: '<i class="nb-trash"></i>',
    //   confirmDelete: true,
    // },
    actions: { delete: false },
    columns: {
      fname: {
        title: this.translateService.instant("COMMON.FIRSTNAME"),
        type: "string",
        filter: {
          type: 'custom',
          component: CustomFilterComponent,
        },
      },
      lname: {
        title: this.translateService.instant("COMMON.LASTNAME"),
        type: "string",
        filter: {
          type: 'custom',
          component: CustomFilterComponent,
        },
      },
      email: {
        title: this.translateService.instant("COMMON.EMAIL"),
        type: "string",
        filter: {
          type: 'custom',
          component: CustomFilterComponent,
        },
      },
      phone: {
        title: this.translateService.instant("COMMON.PHONENO"),
        type: "string",
        filter: {
          type: 'custom',
          component: CustomFilterComponent,
        },
      },
      "group.group": {
        title: this.translateService.instant("ADMIN.ADMINTYPE"),
        width: "16%",
        // type: "string",
        filter: {
          type: "custom",
          component: NgSelectComponent,
          config: {
            options: CommonData.adminType
          },
        },
        valuePrepareFunction: (cols, row) => row?.group?.group || "N/A",
      },
      createdAt: {
        title: this.translateService.instant("ADMIN.CREATEDTIME"),
        valuePrepareFunction: (createdAt) => {
          //return createdAt;
          if (createdAt) {
            return moment(createdAt).format(
              featuresSettings.DateFormatWithTime
            );
          } else return "";
        },
        filter: {
          type: "custom",
          component: DatePickerComponent,
        },
      },
    },
  };
  baseurl = environment.BASEURL;
  source: ServerDataSource;
  ng2SmartTableFilterParams: any;

  constructor(
    private router: Router,
    private dataService: DataService,
    private http: HttpClient,
    private translateService: TranslateService,
    private ActivatedRoute: ActivatedRoute,
    private pageStateService: PagestateService,
    private apiservice: ApiService
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
      endPoint: environment.API_ENDPOINT + "common/admin",
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
    this.router.navigateByUrl("admin/admin/add-edit-admin");
    this.dataService.setNewRowInfo({});
  }

  onEdit(event) {
    this.router.navigate([
      "admin/admin/add-edit-admin",
      { id: event._id, page: this.currentPage },
    ]);
    this.dataService.setNewRowInfo(event);
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
      "common/report/admin" + queryParams,
      "Admin-Report.xlsx"
    );
  }
}
