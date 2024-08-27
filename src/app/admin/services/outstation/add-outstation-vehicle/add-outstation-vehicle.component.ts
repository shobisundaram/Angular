import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { NbMenuService, NbToastrService } from "@nebular/theme";
import { ApiService } from "../../../api.service";
import { DataService } from "../../../data.service";
import { PagestateService } from "../../../pagestate.service";
import { CustomFilterComponent } from "../../../custom-filter/custom-filter.component";
import { CommonData } from "../../../../../environments/environment";
@Component({
  selector: "ngx-add-outstation-vehicle",
  templateUrl: "./add-outstation-vehicle.component.html",
  styleUrls: ["./add-outstation-vehicle.component.scss"],
})
export class AddOutstationVehicleComponent implements OnInit {
  outstationPackageForm: FormGroup;
  taxDetailsForm: FormGroup;
  servicetypes: any;
  currencys: any;
  serviceArea = null;
  packageId = null;
  serviceTypeId = null;
  dataServiceSubscription: any;
  outstationTripType = CommonData.outstationTripType;
  yesorno = CommonData.true_or_false;
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
          event.item.title ===
          this.translate.instant("OUTSTATION.DELETEPACKAGE")
        ) {
          this.deletePackage();
        }
      });
  }
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

  ngOnInit(): void {
    this.initializeForm();
    this.patchForm();
    this.subscribeToMenuItem();
  }

  goBackBtn() {
    this.location.back();
  }

  async initializeForm() {
    this.serviceArea = this.ActivatedRoute.snapshot.paramMap.get("serviceArea");
    this.packageId = this.ActivatedRoute.snapshot.paramMap.get("packageId");
    this.serviceTypeId =
      this.ActivatedRoute.snapshot.paramMap.get("serviceTypeId");
    this.outstationPackageForm = new FormGroup({
      _id: new FormControl(""),
      serviceType: new FormControl(null, Validators.required),
      extraDistanceAmount: new FormControl("", Validators.required),
      extraHoursAmount: new FormControl("", Validators.required),
      currency: new FormControl(null, Validators.required),
      commission: new FormControl("", Validators.required),
      base_fee: new FormControl("", Validators.required),
      booking_fee: new FormControl("", Validators.required),
      trip_type: new FormControl(null, Validators.required),
    });
    this.taxDetailsForm = new FormGroup({
      is_tax_applicable: new FormControl(false),
      tax: new FormControl(0),
    });
    this.apiservice.CommonGetApi("creteria/serviceType/list").subscribe({
      next: (res) => {
        this.servicetypes = res.data.ServiceType;
      },
      error: (error) => {
        this.toasterService.danger(error.error.message);
      },
    });
    this.apiservice.CommonGetApi("common/currency").subscribe({
      next: (res) => {
        this.currencys = res.data.currency;
      },
      error: (error) => {
        this.toasterService.danger(error.error.message);
      },
    });
  }

  get serviceType() {
    return this.outstationPackageForm.get("serviceType");
  }

  get extraDistanceAmount() {
    return this.outstationPackageForm.get("extraDistanceAmount");
  }

  get extraHoursAmount() {
    return this.outstationPackageForm.get("extraHoursAmount");
  }

  get currency() {
    return this.outstationPackageForm.get("currency");
  }

  get base_fee() {
    return this.outstationPackageForm.get("base_fee");
  }

  get booking_fee() {
    return this.outstationPackageForm.get("booking_fee");
  }

  get commission() {
    return this.outstationPackageForm.get("commission");
  }

  get trip_type() {
    return this.outstationPackageForm.get("trip_type");
  }

  onEdit(e) {
    console.log(e);
  }

  ngOnDestroy(): void {
    this.dialogObservable?.unsubscribe();
    this.dataService.setNewRowInfo({});
    this.dataServiceSubscription?.unsubscribe();
  }

  async patchForm() {
    this.dataServiceSubscription = this.dataService
      .getNewRowInfo()
      .subscribe({
        next: (data) => {
          console.log(data);
          this.dataFetchWhileReload();
        },
        error: (err) => console.log(err),
      })
      .unsubscribe();
  }

  dataFetchWhileReload() {
    if (this.packageId && this.serviceTypeId) {
      this.apiservice
        .CommonGetApi(
          `module/outstationTaxi/${this.packageId}/${this.serviceTypeId}`
        )
        .subscribe((res) => {
          const data = res.data.outstationPackage;
          console.log(data, " ======>");
          this.dataService.setNewRowInfo(data);
          this.outstationPackageForm.patchValue({
            _id: data._id,
            serviceType: data.serviceType,
            extraDistanceAmount: data.additional.extraDistanceFare,
            extraHoursAmount: data.additional.extraHoursFare,
            currency: data.currencyId,
            booking_fee: data.bookingFare,
            commission: data.commision,
            trip_type: data.tripType,
            base_fee: data.baseFare,
          });
          this.taxDetailsForm.patchValue({
            is_tax_applicable: data.taxFare.status,
            tax: data.taxFare.fare,
          });
        });
    }
  }

  addOrEditPackage() {
    if (this.outstationPackageForm.invalid) {
      this.outstationPackageForm.markAllAsTouched();
    } else {
      console.log(this.outstationPackageForm.value);
      let payload = this.generatePayload();
      delete payload._id;
      console.log(payload);
      if (this.outstationPackageForm.value._id) {
        this.apiservice
          .CommonPutApi(
            `module/outstationTaxi/${this.packageId}/${this.serviceTypeId}`,
            payload
          )
          .subscribe({
            next: (res) => {
              const data = res.data;
              // this.driverForm.patchValue({
              //   image: this.baseurl + data.onboarding.image,
              // });
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
          .CommonPostApi(payload, `module/outstationTaxi/${this.packageId}`)
          .subscribe({
            next: (res) => {
              const data = res.data;
              this.toasterService.success(res.type, data.message);
              this.goBackBtn();
            },
            error: (error) => {
              console.log(error);
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
    console.log(this.outstationPackageForm.value._id);

    if (this.outstationPackageForm.value._id) {
      let payload = { ...this.outstationPackageForm.value };
      delete payload._id;
      this.apiservice
        .CommonDeleteApi(
          this.serviceTypeId,
          `module/outstationTaxi/${this.packageId}`
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

  generatePayload() {
    let { is_tax_applicable, tax } = this.taxDetailsForm.value;
    let {
      _id,
      serviceType,
      extraDistanceAmount,
      extraHoursAmount,
      currency,
      commission,
      base_fee,
      booking_fee,
      trip_type,
    } = this.outstationPackageForm.value;
    return {
      taxFare: {
        status: is_tax_applicable,
        fare: tax,
      },
      additional: {
        extraDistanceFare: extraDistanceAmount,
        extraHoursFare: extraHoursAmount,
      },
      serviceType: serviceType,
      currencyId: currency,
      bookingFare: booking_fee,
      commision: commission,
      tripType: trip_type,
      baseFare: base_fee,
      _id: _id,
    };
  }
}
