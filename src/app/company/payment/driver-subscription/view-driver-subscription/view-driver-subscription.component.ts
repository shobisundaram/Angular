import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NbToastrService } from "@nebular/theme";
import * as moment from "moment";
import { ServerDataSource } from "ng2-smart-table";
import {
  CommonData,
  environment,
  featuresSettings,
} from "../../../../../environments/environment";
import { SubscriptionStatusChangeComponent } from "../subscription-status-change/subscription-status-change.component";
import { ActivatedRoute, Router } from "@angular/router";
import { CompanyapiService } from "../../../companyapi.service";
import { CompanyDataService } from "../../../company-data.service";
import { CompanyNgSelectComponent } from "../../../company-ng-select/company-ng-select.component";
import { CompanyCustomFilterComponent } from "../../../company-custom-filter/company-custom-filter.component";
import { CompanyDatePickerComponent } from "../../../company-date-picker/company-date-picker.component";
import { TranslateService } from "@ngx-translate/core";
import { PagestateService } from "../../../pagestate.service";

@Component({
  selector: "ngx-view-driver-subscription",
  templateUrl: "./view-driver-subscription.component.html",
  styleUrls: ["./view-driver-subscription.component.scss"],
})
export class ViewDriverSubscriptionComponent implements OnInit {
  initial: number = 0;
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
    actions: {
      delete: false,
    },
    columns: {
      child: {
        title: this.translateService.instant("PACKAGELIST.SUBSCRIBEDPACKAGES"),
        type: "html",
        filter: false,
        sort: false,
        valuePrepareFunction: (cell, row) => {
          return `<a title="Histroy of Driver">
                  <i class="table-edit-icon ion-clipboard"></i></a>`;
        },
      },
      fname: {
        title: this.translateService.instant("PACKAGELIST.DRIVER"),
        filter: {
          type: 'custom',
          component: CompanyCustomFilterComponent,
        },
      },
      uniCode: {
        title: this.translateService.instant("PACKAGELIST.CODE"),
        filter: {
          type: 'custom',
          component: CompanyCustomFilterComponent,
        },
      },
      phone: {
        title: this.translateService.instant("PACKAGELIST.PHONE"),
        filter: {
          type: 'custom',
          component: CompanyCustomFilterComponent,
        },
      },
      endDate: {
        title: this.translateService.instant("PACKAGELIST.SUBSCRIPTION_END_DATE"),
        filter: {
          type: "custom",
          component: CompanyDatePickerComponent,
        },
        valuePrepareFunction: (endDate) => {
          return endDate
            ? moment(endDate).format(featuresSettings.DateFormatWithTime)
            : "N/A";
        },
      },
      status: {
        title: this.translateService.instant("PACKAGELIST.SUBSCRIPTION_STATUS"),
        filter: {
          type: "custom",
          component: CompanyNgSelectComponent,
          config: {
            options: CommonData.subscriptionStatus
          }
        },
        // valuePrepareFunction: (isSubcriptionActive) => {
        //   // if(isSubcriptionActive == true) return "Active";
        //   // else return "Inactive";
        //   return isSubcriptionActive ? "Active" : "Inactive";
        // },
      },
    },
  };

  settings1 = {
    actions: {
      edit: false,
      add: false,
      delete: false,
    },
    pager: {
      display: true,
      perPage: 10,
    },
    columns: {
      type: {
        title: this.translateService.instant("PACKAGELIST.PACKAGETYPE"),
        filter: {
          type: 'custom',
          component: CompanyCustomFilterComponent,
        },
      },
      packageName: {
        title: this.translateService.instant("PACKAGELIST.PACKAGENAME"),
        filter: {
          type: 'custom',
          component: CompanyCustomFilterComponent,
        },
      },
      amount: {
        title: this.translateService.instant("PACKAGELIST.AMOUNT"),
        filter: {
          type: 'custom',
          component: CompanyCustomFilterComponent,
        },
      },
      validity: {
        title: this.translateService.instant("PACKAGELIST.NO_OF_DAYS"),
        filter: {
          type: 'custom',
          component: CompanyCustomFilterComponent,
        },
      },
      startDate: {
        title: this.translateService.instant("COMMON.START_DATE"),
        filter: {
          type: "custom",
          component: CompanyDatePickerComponent,
        },
        valuePrepareFunction: (startDate) => {
          if (startDate) {
            return moment(startDate).format(
              featuresSettings.DateFormatWithTime
            );
          } else return "N/A";
        },
      },
      endDate: {
        title: this.translateService.instant("COMMON.END_DATE"),
        filter: {
          type: "custom",
          component: CompanyDatePickerComponent,
        },
        valuePrepareFunction: (endDate) => {
          if (endDate) {
            return moment(endDate).format(featuresSettings.DateFormatWithTime);
          } else return "N/A";
        },
      },
      purchaseDate: {
        title: this.translateService.instant("COMMON.PURCHASE_DATE"),
        filter: {
          type: "custom",
          component: CompanyDatePickerComponent,
        },
        valuePrepareFunction: (purchaseDate) => {
          if (purchaseDate) {
            return moment(purchaseDate).format(
              featuresSettings.DateFormatWithTime
            );
          } else return "N/A";
        },
      },
      status: {
        title: this.translateService.instant("COMMON.STATUS"),
        filter: {
          type: 'custom',
          component: CompanyCustomFilterComponent,
        },
        valuePrepareFunction: (cell,row) => {
          console.log(cell,row)
          if (row.type == 'SUBSCRIPTION') {
            return row.status
          } else return "---";
        },
      },
      renderBtn: {
        title: this.translateService.instant("PACKAGELIST.ACTIVATE_PACAKE"),
        type: "custom",
        filter: false,
        sort: false,
        renderComponent: SubscriptionStatusChangeComponent,
        onComponentInitFunction: (instance) => {
          instance.emitBack.subscribe((data) => {
            this.source1.refresh();
          });
        },
      },
    },
  };

  source: ServerDataSource;
  source1: ServerDataSource;
  driverSubscriptionForm: FormGroup;
  partners: any;
  packageTypeDropDownData: any[] = featuresSettings.payPackageTypes;
  packageDropDownData: any;
  toDay: Date = new Date();
  startMinDate: Date = new Date(
    this.toDay.getFullYear(),
    this.toDay.getMonth(),
    this.toDay.getDate()
  );
  purchaseMinDate: Date = new Date(
    this.toDay.getFullYear(),
    this.toDay.getMonth(),
    this.toDay.getDate()
  );

  constructor(
    private http: HttpClient,
    private apiservice: CompanyapiService,
    private toasterService: NbToastrService,
    private ActivatedRoute: ActivatedRoute,
    private router: Router,
    private dataService: CompanyDataService,
    private pageStateService: PagestateService,
    private translateService: TranslateService,
  ) {
    Object.keys(this.settings.columns).forEach(key => {
      this.settings.columns[key].sort = featuresSettings.TableSort;
    });
    Object.keys(this.settings1.columns).forEach(key => {
      this.settings1.columns[key].sort = featuresSettings.TableSort;
    });
  }

  ngOnInit(): void {
    this.pageNum =
      +this.ActivatedRoute.snapshot.queryParamMap.get("page") ||
      this.pageStateService.getPage();
    this.initialTableDataRender();
    // this.dataService.setNg2SmartTableFilterOption(
    //   CommonData.subscriptionStatus
    // );
    this.getPackageDate();
    this.initializeDriverSubscriptionForm();
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
    this.apiservice.CommonGetApi("common/partner").subscribe({
      next: (res) => {
        this.partners = res.data.partner;
      },
      error: (error) => {
        this.toasterService.danger(error.error.message);
      },
    });
  }

  onRowSelect(event) {
    this.initialTableDataRender1(event);
  }

  subscribedDriverData: any;
  initialTableDataRender1(event): void {
    this.subscribedDriverData = event.data;
    this.initialValueChange(2);
    this.source1 = new ServerDataSource(this.http, {
      endPoint:
        environment.API_ENDPOINT +
        "module/subscription/purchasePackage?userId=" +
        event.data._id,
      dataKey: "data.package",
      pagerPageKey: "page",
      pagerLimitKey: "limit",
      totalKey: "data.total",
      filterFieldKey: "#field#",
    });
  }

  initializeDriverSubscriptionForm() {
    this.driverSubscriptionForm = new FormGroup({
      id: new FormControl(""),
      partnerId: new FormControl(null, Validators.required),
      package: new FormControl(null, Validators.required),
      package1: new FormControl(""),
      packageType: new FormControl(null, Validators.required),
      transactionId: new FormControl(""),
      transactionType: new FormControl(""),
      amount: new FormControl(0),
      credits: new FormControl(0),
      limit: new FormControl(0),
      purchaseDate: new FormControl("", Validators.required),
      start_date: new FormControl(""),
      endDate: new FormControl(""),
      status: new FormControl(""),
      serviceArea: new FormControl(""),
    });
  }
  get partnerId() {
    return this.driverSubscriptionForm.get("partnerId");
  }
  get packageType() {
    return this.driverSubscriptionForm.get("packageType");
  }
  get package() {
    return this.driverSubscriptionForm.get("package");
  }
  get purchaseDate() {
    return this.driverSubscriptionForm.get("purchaseDate");
  }

  packageFor: any;
  partnerCode: any;

  onAdd(event: Event, data, packageFor) {
    this.packageFor = packageFor;
    this.initialValueChange(data);
  }

  onEdit(event: any, data, packageFor) {
    this.packageFor = packageFor;
    this.initialValueChange(data);
    this.driverSubscriptionForm.patchValue({
      partnerId: event._id,
    });
    this.partnerCode = event.uniCode;
  }

  initialValueChange(data) {
    this.initializeDriverSubscriptionForm();
    // if (this.packageFor === "allDriver") {
    //   this.driverSubscriptionForm.get("partnerId").enable();
    // } else {
    //   this.driverSubscriptionForm.get("partnerId").disable();
    // }
    this.initial = data;
    this.settings.pager.page = this.pageNum;
  }

  getPackageDate() {
    this.apiservice
      .CommonGetApi(
        "module/subscription/package?type=" +
        this.driverSubscriptionForm.value.packageType
      )
      .subscribe({
        next: (res) => {
          this.packageDropDownData = res.data.package;
        },
        error: (error) => {
          this.toasterService.danger(error.error.message);
        },
      });
  }

  addDriverSubscription() {
    if (this.driverSubscriptionForm.invalid) {
      this.driverSubscriptionForm.markAllAsTouched();
    } else {
      const payload = {
        _id: this.driverSubscriptionForm.value.id,
        userId: this.driverSubscriptionForm.value.partnerId,
        packageId: this.driverSubscriptionForm.value.package,
        packageName: this.driverSubscriptionForm.value.package1,
        type: this.driverSubscriptionForm.value.packageType,
        transactionId: this.driverSubscriptionForm.value.transactionId,
        transactionType: this.driverSubscriptionForm.value.transactionType,
        amount: this.driverSubscriptionForm.value.amount,
        credits: this.driverSubscriptionForm.value.credits,
        limit: this.driverSubscriptionForm.value.limit,
        purchaseDate: this.driverSubscriptionForm.value.purchaseDate,
        start_date: this.driverSubscriptionForm.value.start_date,
        endDate: this.driverSubscriptionForm.value.endDate,
        status: this.driverSubscriptionForm.value.status,
        serviceArea: this.driverSubscriptionForm.value.serviceArea,
      };

      if (this.driverSubscriptionForm.value.id) {
        this.apiservice
          .CommonPutApi(
            "module/subscription/purchasePackage/" +
            this.driverSubscriptionForm.value.id,
            payload
          )
          .subscribe({
            next: (res) => {
              const data = res.data;
              this.toasterService.success(res.type, data.message);
            },
            error: (error) => {
              this.toasterService.danger(error.error.message);
            },
          });
      } else {
        this.apiservice
          .CommonPostApi(payload, "module/subscription/purchasePackage")
          .subscribe({
            next: (res) => {
              const data = res.data;
              this.toasterService.success(res.type, data.message);
              this.initialValueChange(0);
            },
            error: (error) => {
              this.toasterService.danger(error.error.message);
            },
          });
      }
    }
  }
}
