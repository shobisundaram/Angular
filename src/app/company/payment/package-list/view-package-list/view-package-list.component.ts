import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ServerDataSource } from "ng2-smart-table";
import {
  CommonData,
  environment,
  featuresSettings,
} from "../../../../../environments/environment";
import { CompanyCustomFilterComponent } from "../../../company-custom-filter/company-custom-filter.component";
import { CompanyDataService } from "../../../company-data.service";
import { CompanyNgSelectComponent } from "../../../company-ng-select/company-ng-select.component";
import { PagestateService } from "../../../pagestate.service";

@Component({
  selector: "ngx-view-package-list",
  templateUrl: "./view-package-list.component.html",
  styleUrls: ["./view-package-list.component.scss"],
})
export class ViewPackageListComponent implements OnInit {
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
      name: {
        title: this.translateService.instant("PACKAGELIST.PACKAGENAME"),
        filter: {
          type: 'custom',
          component: CompanyCustomFilterComponent,
        },
      },
      type: {
        title: this.translateService.instant("PACKAGELIST.PACKAGETYPE"),
        width: "16%",
        filter: {
          type: "custom",
          component: CompanyNgSelectComponent,
          config: {
            options: CommonData.packageType
          }
        },
      },
      amount: {
        title: this.translateService.instant("PACKAGELIST.PACKAGEAMOUNT"),
        filter: {
          type: 'custom',
          component: CompanyCustomFilterComponent,
        },
      },
      credits: {
        title: this.translateService.instant("PACKAGELIST.PACKAGECREDIT"),
        filter: {
          type: 'custom',
          component: CompanyCustomFilterComponent,
        },
      },
      validity: {
        title: this.translateService.instant("PACKAGELIST.PACKAGEVALIDITY"),
        filter: {
          type: 'custom',
          component: CompanyCustomFilterComponent,
        },
      },
      userLimit: {
        title: this.translateService.instant("COMMON.USER_LIMIT"),
        filter: {
          type: 'custom',
          component: CompanyCustomFilterComponent,
        },
        valuePrepareFunction: (cell, row) => {
          return row.limit ? row.limit : "N/A";
        },
      },
      description: {
        title: this.translateService.instant("COMMON.DESCRIPTION"),
        filter: {
          type: 'custom',
          component: CompanyCustomFilterComponent,
        },
      },
    },
  };
  baseurl = environment.BASEURL;
  source: ServerDataSource;

  constructor(
    private router: Router,
    private dataService: CompanyDataService,
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
      endPoint: environment.API_ENDPOINT + "module/subscription/package",
      dataKey: "data.package",
      pagerPageKey: "page",
      pagerLimitKey: "limit",
      totalKey: "data.count",
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
    this.router.navigateByUrl("company/payment/package-list/add-package-list");
    this.dataService.setNewRowInfo({});
  }

  onEdit(event) {
    this.router.navigate([
      "company/payment/package-list/add-package-list",
      { id: event._id, page: this.currentPage },
    ]);
    this.dataService.setNewRowInfo(event);
  }
}