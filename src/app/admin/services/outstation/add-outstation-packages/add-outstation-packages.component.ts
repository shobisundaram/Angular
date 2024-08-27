import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { NbMenuService, NbToastrService } from "@nebular/theme";
import { ApiService } from "../../../api.service";
import { DataService } from "../../../data.service";
import { PagestateService } from "../../../pagestate.service";
import { CustomFilterComponent } from "../../../custom-filter/custom-filter.component";
import { NgSelectComponent } from "../../../ng-select/ng-select.component";
import { CommonData } from "../../../../../environments/environment";
@Component({
  selector: "ngx-add-outstation-packages",
  templateUrl: "./add-outstation-packages.component.html",
  styleUrls: ["./add-outstation-packages.component.scss"],
})
export class AddOutstationPackagesComponent implements OnInit {
  pageNum: any = 1;
  currentPage: number;
  settings = {
    pager: {
      display: true,
    },
    mode: "external",
    edit: {
      editButtonContent: '<i class="fa fa-edit table-edit-icon"></i>',
    },
    actions: { delete: false, add: false },
    columns: {
      serviceType: {
        title: this.translateService.instant("COMMON.VEHICELTYPE"),
        type: "string",
        filter: {
          type: "custom",
          component: CustomFilterComponent,
        },
      },
      tripType: {
        title: this.translateService.instant("OUTSTATION.TRIPTYPE"),
        width: "13%",
        // type: "string",
        filter: {
          type: "custom",
          component: NgSelectComponent,
          config: {
            options: CommonData.outstationTripTypeTable,
          },
        },
        valuePrepareFunction: (cell, row) =>
          cell == "round" ? "Round Trip" : "Oneway Trip",
      },
      baseFare: {
        title: this.translateService.instant("PRICING.FARE_DETAILS.BASE_FEE"),
        type: "string",
        filter: {
          type: "custom",
          component: CustomFilterComponent,
        },
      },
      extraDistanceFare: {
        title: this.translateService.instant("OUTSTATION.EXTRADISTANCEAMOUNT"),
        type: "string",
        filter: {
          type: "custom",
          component: CustomFilterComponent,
        },
        valuePrepareFunction: (cell, row) =>
          row.additional?.extraDistanceFare || "",
      },
      extraHoursFare: {
        title: this.translateService.instant("OUTSTATION.EXTRAHOURSAMOUNT"),
        type: "string",
        filter: {
          type: "custom",
          component: CustomFilterComponent,
        },
        valuePrepareFunction: (cell, row) =>
          row.additional?.extraHoursFare || "",
      },
    },
  };
  serviceAvailableCities: any;
  dataServiceSubscription: any;
  data = [];
  showTaxi = false;
  constructor(
    private location: Location,
    public translate: TranslateService,
    private router: Router,
    private dataService: DataService,
    private http: HttpClient,
    private translateService: TranslateService,
    private pageStateService: PagestateService,
    private ActivatedRoute: ActivatedRoute,
    private apiservice: ApiService,
    private toasterService: NbToastrService,
    private menuService: NbMenuService
  ) {}
  outstationPackageForm: FormGroup;
  outstationItems = [
    {
      icon: "plus-outline",
      title: this.translate.instant("OUTSTATION.ADDNEWTAXIS"),
    },
  ];
  items = [
    {
      icon: "trash-2",
      title: this.translate.instant("OUTSTATION.DELETEPACKAGE"),
    },
  ];
  dialogObservable: any;
  subscribeToMenuItem() {
    this.dialogObservable = this.menuService
      .onItemClick()
      .subscribe((event) => {
        console.log(event.item.title);
        if (
          event.item.title === this.translate.instant("OUTSTATION.ADDNEWTAXIS")
        ) {
          this.routetoAddTaxi();
        }
        if (
          event.item.title ===
          this.translate.instant("OUTSTATION.DELETEPACKAGE")
        ) {
          this.deletePackage();
        }
      });
  }
  ngOnInit(): void {
    this.initializeForm();
    this.patchForm();
    this.subscribeToMenuItem();
  }

  goBackBtn() {
    this.location.back();
  }

  async initializeForm() {
    console.log(this.ActivatedRoute.snapshot.paramMap.get("serviceArea"));

    this.apiservice.CommonGetApi("creteria/serviceArea/list").subscribe({
      next: (res) => {
        this.serviceAvailableCities = res.data.serviceArea;
      },
      error: (error) => {
        this.toasterService.danger(error.error.message);
      },
    });
    this.ActivatedRoute.snapshot.paramMap.get("serviceArea");
    this.outstationPackageForm = new FormGroup({
      _id: new FormControl(""),
      packageName: new FormControl("", Validators.required),
      hours: new FormControl("", Validators.required),
      distance: new FormControl("", Validators.required),
      serviceArea: new FormControl(
        this.ActivatedRoute.snapshot.paramMap.get("serviceArea") ==
          "undefined" ||
        this.ActivatedRoute.snapshot.paramMap.get("serviceArea") == "null"
          ? null
          : this.ActivatedRoute.snapshot.paramMap.get("serviceArea"),
        Validators.required
      ),
    });
  }

  async patchForm() {
    this.dataServiceSubscription = this.dataService
      .getNewRowInfo()
      .subscribe({
        next: (data) => {
          console.log(data);
          if (JSON.stringify(data) !== "{}") {
            this.showTaxi = true;
            this.outstationPackageForm.patchValue({
              _id: data._id,
              packageName: data.packageName,
              hours: data.hours,
              distance: data.distance,
              serviceArea: data.serviceArea,
            });
            this.data = data.serviceType;
          } else {
            this.dataFetchWhileReload();
          }
        },
        error: (err) => console.log(err),
      })
      .unsubscribe();
  }

  dataFetchWhileReload() {
    let id =
      this.ActivatedRoute.snapshot.paramMap.get("id") ||
      sessionStorage.getItem("_id");
    console.log(id);
    if (id) {
      this.apiservice
        .CommonGetApi("module/outstationPackage/" + id)
        .subscribe((res) => {
          const data = res.data.Outstation[0];
          this.dataService.setNewRowInfo(data);
          this.patchForm();
        });
    }
  }
  get packageName() {
    return this.outstationPackageForm.get("packageName");
  }

  get hours() {
    return this.outstationPackageForm.get("hours");
  }

  get distance() {
    return this.outstationPackageForm.get("distance");
  }

  get serviceArea() {
    return this.outstationPackageForm.get("serviceArea");
  }

  onEdit(e) {
    this.router.navigate([
      "admin/services/add-outstation-vehicle",
      {
        serviceTypeId: e._id,
        packageId:
          this.ActivatedRoute.snapshot.paramMap.get("id") ||
          this.outstationPackageForm.get("_id").value,
      },
    ]);
    this.dataService.setNewRowInfo(e);
  }

  routetoAddTaxi(): void {
    console.log(
      this.ActivatedRoute.snapshot.paramMap.get("id"),
      "==============> CHECK ROUTE"
    );

    this.router.navigate([
      "admin/services/add-outstation-vehicle",
      {
        packageId:
          this.ActivatedRoute.snapshot.paramMap.get("id") ||
          this.outstationPackageForm.get("_id").value,
      },
    ]);
    this.dataService.setNewRowInfo({});
  }

  ngOnDestroy(): void {
    this.dialogObservable?.unsubscribe();
    this.dataServiceSubscription?.unsubscribe();
  }

  addOrEditPackage() {
    if (this.outstationPackageForm.invalid) {
      this.outstationPackageForm.markAllAsTouched();
    } else {
      console.log(this.outstationPackageForm.value);
      this.showTaxi = true;
      if (this.outstationPackageForm.value._id) {
        let payload = { ...this.outstationPackageForm.value };
        delete payload._id;
        console.log(payload);
        this.apiservice
          .CommonPutApi(
            "module/outstationPackage/" + this.outstationPackageForm.value._id,
            payload
          )
          .subscribe({
            next: (res) => {
              const data = res.data;
              this.toasterService.success(res.type, data.message);
            },
            error: (error) => {
              this.toasterService.danger(
                error.error.message,
                error.error.error
              );
            },
          });
      } else {
        this.apiservice
          .CommonPostApi(
            this.outstationPackageForm.value,
            "module/outstationPackage"
          )
          .subscribe({
            next: (res) => {
              const data = res.data;
              this.toasterService.success(res.type, data.message);
              this.outstationPackageForm.patchValue({ _id: data.newDoc._id });
              sessionStorage.setItem("_id", data.newDoc._id);
              console.log(this.outstationPackageForm.value);
            },
            error: (error) => {
              this.toasterService.danger(
                error.error.message,
                error.error.error
              );
            },
          });
      }
    }
  }

  deletePackage() {
    if (this.outstationPackageForm.value._id) {
      let payload = { ...this.outstationPackageForm.value };
      delete payload._id;
      this.apiservice
        .CommonDeleteApi(
          this.outstationPackageForm.value._id,
          "module/outstationPackage"
        )
        .subscribe({
          next: (res) => {
            const data = res.data;
            this.toasterService.success(res.type, data.message);
            this.goBackBtn();
          },
          error: (error) => {
            this.toasterService.danger(error.error.message);
          },
        });
    }
  }
}
