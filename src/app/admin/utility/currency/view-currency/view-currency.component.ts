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
import { NgSelectComponent } from "../../../ng-select/ng-select.component";
import { PagestateService } from "../../../pagestate.service";

@Component({
  selector: 'ngx-view-currency',
  templateUrl: './view-currency.component.html',
  styleUrls: ['./view-currency.component.scss']
})
export class ViewCurrencyComponent implements OnInit {

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
        title: this.translateService.instant("CURRENCY.CURRENCYNAME"),
        type: "string",
        filter: {
          type: 'custom',
          component: CustomFilterComponent,
        },
      },
      code: {
        title: this.translateService.instant("CURRENCY.CURRENCYCODE"),
        type: "string",
        filter: {
          type: 'custom',
          component: CustomFilterComponent,
        },
      },
      symbol: {
        title: this.translateService.instant("CURRENCY.CURRENCYSYMBOL"),
        type: "string",
        filter: {
          type: 'custom',
          component: CustomFilterComponent,
        },
      },
      status: {
        title: this.translateService.instant("COMMON.STATUS"),
        valuePrepareFunction: (status) => {
          return status == true ? "Active" : "In Active";
        },
        filter: {
          type: "custom",
          component: NgSelectComponent,
          config: {
            options: CommonData.activeInactive
          },
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
      endPoint: environment.API_ENDPOINT + "common/currency",
      dataKey: "data.currency",
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
    this.router.navigateByUrl("admin/utility/add-edit-currency");
    this.dataService.setNewRowInfo({});
  }

  onEdit(event) {
    this.router.navigate([
      "admin/utility/add-edit-currency",
      { id: event._id, page: this.currentPage },
    ]);
    this.dataService.setNewRowInfo(event);
  }
}

