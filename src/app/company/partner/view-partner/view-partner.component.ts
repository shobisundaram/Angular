import { Component, OnInit } from '@angular/core';
import { CompanyCustomFilterComponent } from '../../company-custom-filter/company-custom-filter.component';
import { CompanyDatePickerComponent } from '../../company-date-picker/company-date-picker.component';
import { CompanyNgSelectComponent } from '../../company-ng-select/company-ng-select.component';
import * as moment from "moment";
import { CommonData, environment, featuresSettings } from '../../../../environments/environment';
import { CompanyDataService } from '../../company-data.service';
import { HttpClient } from '@angular/common/http';
import { Router,ActivatedRoute } from '@angular/router';
import { ServerDataSource } from 'ng2-smart-table';
import { CompanyapiService } from '../../companyapi.service';
import { TranslateService } from '@ngx-translate/core';
import { PagestateService } from '../../pagestate.service';

@Component({
  selector: 'ngx-view-partner',
  templateUrl: './view-partner.component.html',
  styleUrls: ['./view-partner.component.scss']
})
export class ViewPartnerComponent implements OnInit {
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
      uniCode: {
        title: this.translateService.instant("COMMON.CODE"),
        filter: {
          type: 'custom',
          component: CompanyCustomFilterComponent,
        },
      },
      fname: {
        title: this.translateService.instant("COMMON.PARTNERNAME"),
        filter: {
          type: 'custom',
          component: CompanyCustomFilterComponent,
        },
      },
      email: {
        title: this.translateService.instant("COMMON.EMAIL"),
        filter: {
          type: 'custom',
          component: CompanyCustomFilterComponent,
        },
      },
      phone: {
        title: this.translateService.instant("COMMON.PHONENO"),
        filter: {
          type: 'custom',
          component: CompanyCustomFilterComponent,
        },
      },
      status: {
        title: this.translateService.instant("COMMON.STATUS"),
        width: "13%",

        filter: {

          type: "custom",
          component: CompanyNgSelectComponent,
          config: {
            options: CommonData.accountStatus
          },
        },
      },

      updatedAt: {
        title: this.translateService.instant("COMMON.LAST_UPDATED_TIME"),
        valuePrepareFunction: (lastUpdate) => {
          //return lastUpdate;
          if (lastUpdate) {
            return moment(lastUpdate).format(
              featuresSettings.DateFormatWithTime
            );
          } else return "";
        },
        filter: {
          type: "custom",
          component: CompanyDatePickerComponent
        },
      },
      online: {
        title: this.translateService.instant("COMMON.ONLINESTATUS"),
        valuePrepareFunction: (online) => {
          return online == true ? "Online" : "Offline";
        },
        filter: {
          type: "custom",
          component: CompanyNgSelectComponent,
          config: {
            options: CommonData.onlineStatus
          },
        },
      },
      // profile: {
      //   title: "Image",
      //   type: "html",
      //   filter: false,
      //   valuePrepareFunction: (profile: string, status: any) => {
      //     if (status.status == "Pending") {
      //       return `<img class="fileImageForng2-table pending" src="${
      //         this.baseurl + profile
      //       }" alt='icon' />`;
      //     } else if (status.status == "Active") {
      //       return `<img class="fileImageForng2-table active" src="${
      //         this.baseurl + profile
      //       }" alt='icon' />`;
      //     } else if (status.status == "Inactive") {
      //       return `<img class="fileImageForng2-table inactive" src="${
      //         this.baseurl + profile
      //       }" alt='icon' />`;
      //     }
      //   },
      // },
    },
  };
  baseurl = environment.BASEURL;
  source: ServerDataSource;
  ng2SmartTableFilterParams: any;
  constructor(
    private router: Router,
    private dataService: CompanyDataService,
    private http: HttpClient,
    private ActivatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    private pageStateService: PagestateService,
    private apiservice: CompanyapiService
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
      endPoint: environment.API_ENDPOINT + "common/partner",
      dataKey: "data.partner",
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
    this.router.navigateByUrl("company/partner/add-edit-partner");
    this.dataService.setDriverDataInfo({});
  }

  onEdit(event) {
    this.router.navigate([
      "company/partner/add-edit-partner",
      { id: event._id, page: this.currentPage },
    ]);
    this.dataService.setDriverDataInfo(event);
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
      "common/report/partner" + queryParams,
      "Partner-Report.xlsx"
    );
  }
}
