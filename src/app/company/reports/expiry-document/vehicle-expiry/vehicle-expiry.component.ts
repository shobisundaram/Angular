import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ServerDataSource } from 'ng2-smart-table';
import { environment, featuresSettings } from '../../../../../environments/environment';
import { CompanyDataService } from '../../../company-data.service';
import { PagestateService } from '../../../pagestate.service';


@Component({
  selector: 'ngx-vehicle-expiry',
  templateUrl: './vehicle-expiry.component.html',
  styleUrls: ['./vehicle-expiry.component.scss']
})
export class VehicleExpiryComponent implements OnInit {
  source: ServerDataSource;
  currentPage: any;
  pageNum: any = 1;
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
      registrationnumber: {
        title: this.translateService.instant("VEHICLEADD.VEHICLENO"),
        type: "string",
      },
      makeName: {
        title: this.translateService.instant("MAKE.MAKE"),
        type: "string",
      },
      modelName: {
        title: this.translateService.instant("MODEL.MODEL"),
        type: "string",
      },
      // insurance: {
      //   title: this.translateService.instant("COMMON.INSURANCEEXPIRY"),
      //   valuePrepareFunction: (cell, row) => {
      //     return row.document[0].field[3].value
      //       ? row.document[0].field[3].value
      //       : "N/A";
      //   },
      // },
    },
  };
  ng2SmartTableFilterParams: any;
  constructor(
    private translateService: TranslateService,
    private router: Router,
    private ActivatedRoute : ActivatedRoute,
    private pageStateService: PagestateService,
    private dataService: CompanyDataService,
    private http: HttpClient
  ) {
    Object.keys(this.settings.columns).forEach(key => {
      this.settings.columns[key].sort = featuresSettings.TableSort;
    });
   }

  ngOnInit(): void {
    this.dataService.setNewRowInfo({});
    this.pageNum = +this.ActivatedRoute.snapshot.queryParamMap.get('page') || this.pageStateService.getPage();
    this.initialVehicleDocumentExpiryDetails()
    this.source.onChanged().subscribe((change) => {
      this.pageStateService.handlePageChange(change, this.ActivatedRoute);
    });
  }
  initialVehicleDocumentExpiryDetails(): void {
    this.settings.pager.page = this.pageNum;
    this.source = new ServerDataSource(this.http, {
      endPoint:
        environment.API_ENDPOINT + "common/document/expiredVehicles",
      dataKey: "data.vehicleList",
      pagerPageKey: "page",
      pagerLimitKey: "limit",
      totalKey: "data.total",
      filterFieldKey: "#field#",
    });
  }
  VehicledocumentExpiryDetails(event){
    this.router.navigate([
      "company/vehicle/add-edit-vehicle",
      { id: event._id,page: this.currentPage },
    ]);
  }
}
