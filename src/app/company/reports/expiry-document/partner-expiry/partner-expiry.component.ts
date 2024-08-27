import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ServerDataSource } from 'ng2-smart-table';
import { environment, featuresSettings } from '../../../../../environments/environment';
import { CompanyDataService } from '../../../company-data.service';
import { PagestateService } from '../../../pagestate.service';


@Component({
  selector: 'ngx-partner-expiry',
  templateUrl: './partner-expiry.component.html',
  styleUrls: ['./partner-expiry.component.scss']
})
export class PartnerExpiryComponent implements OnInit {
  source: ServerDataSource;
  currentPage: any;
  pageNum: any = 1;
  ng2SmartTableFilterParams: any;
  settings = {
    pager: {
      display: true,
      perPage: 10,
      page: this.pageNum,
    },
    mode: "external",
    edit: {
      editButtonContent: '<i class="nb-arrow-retweet table-email-icon"></i>',
    },
    actions: { delete: false, add: false },
    columns: {
      uniCode: {
        title: this.translateService.instant("COMMON.UNICODE"),
        type: "string",
      },
      fname: {
        title: this.translateService.instant("COMMON.FIRSTNAME"),
        type: "string",
      },
      phone: {
        title: this.translateService.instant("COMMON.PHONENO"),
        type: "string",
      },
      // partnerLicence: {
      //   title: this.translateService.instant("COMMON.DRIVINGLICENCEEXPIRY"),
      //   valuePrepareFunction: (cell, row) => {
      //     return row.document[0].field[1].value
      //       ? row.document[0].field[1].value
      //       : "N/A";
      //   },
      // },
      // idProof: {
      //   title: this.translateService.instant("COMMON.IDPROOFEXPIRY"),
      //   valuePrepareFunction: (cell, row) => {
      //     return row.document[1].field[1].value
      //       ? row.document[1].field[1].value
      //       : "N/A";
      //   },
      // },
    },
  };

  constructor(
    private translateService: TranslateService,
    private router: Router,
    private ActivatedRoute : ActivatedRoute,
    private dataService: CompanyDataService,
    private pageStateService: PagestateService,
    private http: HttpClient
  ) { 
    Object.keys(this.settings.columns).forEach(key => {
      this.settings.columns[key].sort = featuresSettings.TableSort;
    });
  }

  ngOnInit(): void {
    this.dataService.setDriverDataInfo({});
    this.pageNum = +this.ActivatedRoute.snapshot.queryParamMap.get('page') || this.pageStateService.getPage();
    this.initialDriverDocumentExpiryDetails();
    this.source.onChanged().subscribe((change) => {
      this.pageStateService.handlePageChange(change, this.ActivatedRoute);
    });
  }
  initialDriverDocumentExpiryDetails(): void {
    this.settings.pager.page = this.pageNum;
    this.source = new ServerDataSource(this.http, {
      endPoint:
        environment.API_ENDPOINT + "common/document/expiredPartners",
      dataKey: "data.partnerList",
      pagerPageKey: "page",
      pagerLimitKey: "limit",
      totalKey: "data.total",
      filterFieldKey: "#field#",
    });
  }
  documentExpiryDetails(event) {
    console.log(event)
    this.router.navigate([
      "company/partner/add-edit-partner",
      { id: event._id, page: this.currentPage},
    ]);
  }
}
