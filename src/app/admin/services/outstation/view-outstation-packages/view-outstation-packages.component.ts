import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { ServerDataSource } from "ng2-smart-table";
import {
  environment,
  featuresSettings,
} from "../../../../../environments/environment";
import { DataService } from "../../../data.service";
import { TranslateService } from "@ngx-translate/core";
import { CustomFilterComponent } from "../../../custom-filter/custom-filter.component";
import { PagestateService } from "../../../pagestate.service";
import { ApiService } from "../../../api.service";
import { NbToastrService } from "@nebular/theme";

@Component({
  selector: "ngx-view-outstation-packages",
  templateUrl: "./view-outstation-packages.component.html",
  styleUrls: ["./view-outstation-packages.component.scss"],
})
export class ViewOutstationPackagesComponent implements OnInit {
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
      packageName: {
        title: this.translateService.instant("OUTSTATION.PACKAGES"),
        type: "string",
        filter: {
          type: "custom",
          component: CustomFilterComponent,
        },
      },
      hours: {
        title: this.translateService.instant("OUTSTATION.HOURS"),
        type: "string",
        placeholder: this.translateService.instant("OUTSTATION.HOURS_EXACT"),
        filter: {
          type: "custom",
          component: CustomFilterComponent,
        },
      },
      distance: {
        title: this.translateService.instant("OUTSTATION.DISTANCE"),
        type: "string",
        placeholder: this.translateService.instant("OUTSTATION.DISTANCE_EXACT"),
        filter: {
          type: "custom",
          component: CustomFilterComponent,
        },
      },
    },
  };
  baseurl = environment.BASEURL;
  source: ServerDataSource;
  serviceAvailableCities: any;
  selectedCites: any;
  constructor(
    private router: Router,
    private dataService: DataService,
    private http: HttpClient,
    private translateService: TranslateService,
    private pageStateService: PagestateService,
    private ActivatedRoute: ActivatedRoute,
    private apiservice: ApiService,
    private toasterService: NbToastrService
  ) {
    Object.keys(this.settings.columns).forEach((key) => {
      this.settings.columns[key].sort = featuresSettings.TableSort;
    });
  }

  ngOnInit(): void {
    this.apiservice.CommonGetApi("creteria/serviceArea/list").subscribe({
      next: (res) => {
        this.serviceAvailableCities = res.data.serviceArea;
      },
      error: (error) => {
        this.toasterService.danger(error.error.message);
      },
    });
    this.pageNum =
      +this.ActivatedRoute.snapshot.queryParamMap.get("page") ||
      this.pageStateService.getPage();
    this.selectedCites = this.ActivatedRoute.snapshot.queryParamMap.get("serviceArea")
    this.initialTableDataRender();
  }
  initialTableDataRender(): void {
    sessionStorage.removeItem('_id')
    this.settings.pager.page = this.pageNum;

    this.source = new ServerDataSource(this.http, {
      endPoint:
        environment.API_ENDPOINT +
        `module/outstationPackage${
          this.selectedCites ? `?serviceArea=${this.selectedCites}` : ``
        }`,
      dataKey: "data.Outstation",
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
    console.log("calling add...........");

    this.dataService.setNewRowInfo({});
    this.router.navigate([
      "admin/services/add-outstation-package",
      { serviceArea: this.selectedCites },
    ]);
  }

  onEdit(event) {
    console.log("calling edit ..........");

    this.router.navigate([
      "admin/services/add-outstation-package",
      { id: event._id, page: this.pageNum, serviceArea: this.selectedCites },
    ]);
    this.dataService.setNewRowInfo(event);
  }
  selectedCity(e) {
    console.log(e);
    this.selectedCites = e;
    this.initialTableDataRender();
    const navigationExtras: NavigationExtras = {
      queryParams: {
        ...this.ActivatedRoute.snapshot.queryParams,
        serviceArea: this.selectedCites,
      },
      queryParamsHandling: "merge",
    };
    this.router.navigate([], navigationExtras);
  }
}
