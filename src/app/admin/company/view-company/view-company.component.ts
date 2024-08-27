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
import { PagestateService } from "../../pagestate.service";

@Component({
  selector: "ngx-view-company",
  templateUrl: "./view-company.component.html",
  styleUrls: ["./view-company.component.scss"],
})
export class ViewCompanyComponent implements OnInit {
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
      fname: {
        title: this.translateService.instant("COMMON.FIRSTNAME"),
        type: "string",
      },
      lname: {
        title: this.translateService.instant("COMMON.LASTNAME"),
        type: "string",
      },
      email: {
        title: this.translateService.instant("COMMON.EMAIL"),
        type: "string",
      },
      phone: {
        title: this.translateService.instant("COMMON.PHONENO"),
        type: "string",
      },
      updatedAt: {
        title: this.translateService.instant("COMMON.LAST_UPDATED_TIME"),
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
      endPoint: environment.API_ENDPOINT + "common/company",
      dataKey: "data.company",
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
    this.router.navigateByUrl("admin/company/add-edit-company");
    this.dataService.setNewRowInfo({});
  }

  onEdit(event) {
    this.router.navigate([
      "admin/company/add-edit-company",
      { id: event._id, page: this.currentPage },
    ]);
    this.dataService.setNewRowInfo(event);
  }
}
