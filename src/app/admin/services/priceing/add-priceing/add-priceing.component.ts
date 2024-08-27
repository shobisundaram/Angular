import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { DataService } from "../../../data.service";
import {
  environment,
  CommonData,
  featuresSettings,
} from "../../../../../environments/environment";
import { ApiService } from "../../../api.service";
import {
  NbDialogService,
  NbMenuService,
  NbToastrService,
} from "@nebular/theme";
import { Location } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";
import { Priceing } from "../../../../@theme/interface/interface";

@Component({
  selector: "ngx-add-priceing",
  templateUrl: "./add-priceing.component.html",
  styleUrls: ["./add-priceing.component.scss"],
})
export class AddPriceingComponent implements OnInit, OnDestroy {
  @ViewChild("DeleteDialog") deleteDialog: TemplateRef<any>;
  items = [
    { icon: "trash-2", title: this.translate.instant("PRICING.DELETEPRICING") },
  ];
  priceingDeleteDialogClose: import("@nebular/theme").NbDialogRef<any>;
  baseurl = environment.BASEURL;
  rawData: Priceing;
  fareDetailsForm: FormGroup;
  driverConveyanceForm: FormGroup;
  taxDetailsForm: FormGroup;
  cancellationDetailsForm: FormGroup;
  peakHourDetailsForm: FormGroup;
  nightHourDetailsForm: FormGroup;
  waitingTimeDetailsForm: FormGroup;
  yesorno = CommonData.true_or_false;
  fareType0 = CommonData.fareType0;
  fareType1 = CommonData.fareType1;
  status = CommonData.status;
  servicetypes: any;
  dataServiceSubscition: any;
  serviceAvailableCitie: any;
  currencys: any;

  constructor(
    private dataService: DataService,
    private apiservice: ApiService,
    private toasterService: NbToastrService,
    private location: Location,
    public translate: TranslateService,
    private dialogService: NbDialogService,
    private menuService: NbMenuService,
    private ActivatedRoute: ActivatedRoute
  ) { }
  dialogObservable: any;

  ngOnInit(): void {
    this.initializeDetailsForm();
    this.patchdriverForm();
    this.subscribeToMenuItem();
  }

  ngOnDestroy(): void {
    this.dialogObservable.unsubscribe();
    this.dataServiceSubscition.unsubscribe();
    if (this.priceingDeleteDialogClose) this.priceingDeleteDialogClose.close();
  }

  initializeDetailsForm() {
    this.fareDetailsForm = new FormGroup({
      id: new FormControl(""),
      servicetype: new FormControl(null, Validators.required),
      currency: new FormControl(null, Validators.required),
      serviceAvailableCities: new FormControl("", Validators.required),
      base_fee: new FormControl("", Validators.required),
      booking_fee: new FormControl("", Validators.required),
      minimum_fee: new FormControl("", Validators.required),
      fareType: new FormControl(null, Validators.required),
      fareValue: new FormControl("", Validators.required),
      time_min_rate_for_running: new FormControl("", Validators.required),
      commission: new FormControl("", Validators.required),
    });
    this.driverConveyanceForm = new FormGroup({
      is_conveyance_charge_needed: new FormControl(null),
      conveyance_charge: new FormControl("0"),
    });
    this.taxDetailsForm = new FormGroup({
      is_tax_applicable: new FormControl(null),
      tax: new FormControl("0"),
    });
    this.cancellationDetailsForm = new FormGroup({
      cancellation_charge_for_rider: new FormControl("0"),
      cancellation_charge_for_driver: new FormControl("0"),
    });
    this.peakHourDetailsForm = new FormGroup({
      peak_hour_1_start_time: new FormControl(""),
      peak_hour_1_end_time: new FormControl(""),
      peak_hour_1_fareType: new FormControl(null),
      peak_hour_1_increase_total_fare: new FormControl("0"),
      peak_hour_1_active_status: new FormControl(null),
      peak_hour_2_start_time: new FormControl(""),
      peak_hour_2_end_time: new FormControl(""),
      peak_hour_2_fareType: new FormControl(null),
      peak_hour_2_increase_total_fare: new FormControl("0"),
      peak_hour_2_active_status: new FormControl(null),
    });
    this.nightHourDetailsForm = new FormGroup({
      night_hour_start_time: new FormControl(""),
      night_hour_end_time: new FormControl(""),
      night_hour_fareType: new FormControl(null),
      night_hour_increase_total_fare: new FormControl("0"),
      night_hour_active_status: new FormControl(null),
    });
    this.waitingTimeDetailsForm = new FormGroup({
      is_waiting_time_charge_applicable: new FormControl(null),
      how_much_time: new FormControl("0"),
      how_much_charge: new FormControl("0"),
    });
    this.apiservice.CommonGetApi("creteria/serviceType").subscribe({
      next: (res) => {
        this.servicetypes = res.data.admin;
      },
      error: (error) => {
        this.toasterService.danger(error.error.message);
      },
    });
    this.apiservice.CommonGetApi("creteria/serviceArea/list").subscribe({
      next: (res) => {
        this.serviceAvailableCitie = res.data.serviceArea;
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
    this.apiservice.CommonGetApi("creteria/serviceType/list").subscribe({
      next: (res) => {
        console.log("servicetypelist")
        this.servicetypes = res.data.ServiceType;
        this.fareDetailsForm.patchValue({
          serviceAvailableCities: this.rawData.serviceAreaId
        });
      },
      error: (error) => {
        this.toasterService.danger(error.error.message);
      },
    });
  }

  get servicetype() {
    return this.fareDetailsForm.get("servicetype");
  }
  get currency() {
    return this.fareDetailsForm.get("currency");
  }
  get serviceAvailableCities() {
    return this.fareDetailsForm.get("serviceAvailableCities");
  }
  get fareType() {
    return this.fareDetailsForm.get("fareType");
  }
  get base_fee() {
    return this.fareDetailsForm.get("base_fee");
  }
  get booking_fee() {
    return this.fareDetailsForm.get("booking_fee");
  }
  get minimum_fee() {
    return this.fareDetailsForm.get("minimum_fee");
  }
  get fareValue() {
    return this.fareDetailsForm.get("fareValue");
  }
  get commission() {
    return this.fareDetailsForm.get("commission");
  }
  get time_min_rate_for_running() {
    return this.fareDetailsForm.get("time_min_rate_for_running");
  }

  patchdriverForm(): void {
    this.dataServiceSubscition = this.dataService
      .getNewRowInfo()
      .subscribe((data) => {

        const rowData: Priceing = data;

        if (JSON.stringify(rowData) !== "{}") {
          this.rawData = rowData
          this.fareDetailsForm.patchValue({

            id: rowData._id,
            servicetype: rowData.serviceId._id,
            currency: rowData.currencyId,
            fareType: rowData.fare.type,
            base_fee: rowData.baseFare,
            booking_fee: rowData.bookingFare,
            minimum_fee: rowData.minimumFare,
            fareValue: rowData.fare.value,
            commission: rowData.commision,
            time_min_rate_for_running: rowData.timeFare,
          });
          this.driverConveyanceForm.patchValue({
            is_conveyance_charge_needed: rowData.additional.pickupFare.status,
            conveyance_charge: rowData.additional.pickupFare.value,
          });
          this.taxDetailsForm.patchValue({
            is_tax_applicable: rowData.taxFare.status,
            tax: rowData.taxFare.fare,
          });
          this.cancellationDetailsForm.patchValue({
            cancellation_charge_for_rider: rowData.cancelationFare.customer,
            cancellation_charge_for_driver: rowData.cancelationFare.partner,
          });
          this.peakHourDetailsForm.patchValue({
            peak_hour_1_start_time: new Date(
              rowData.additional.peakFare[0].from
            ).toISOString(),
            peak_hour_1_end_time: new Date(
              rowData.additional.peakFare[0].to
            ).toISOString(),
            peak_hour_1_fareType: rowData.additional.peakFare[0].fare.type,
            peak_hour_1_increase_total_fare:
              rowData.additional.peakFare[0].fare.value,
            peak_hour_1_active_status: rowData.additional.peakFare[0].status,
            peak_hour_2_start_time: new Date(
              rowData.additional.peakFare[1].from
            ).toISOString(),
            peak_hour_2_end_time: new Date(
              rowData.additional.peakFare[1].to
            ).toISOString(),
            peak_hour_2_fareType: rowData.additional.peakFare[1].fare.type,
            peak_hour_2_increase_total_fare:
              rowData.additional.peakFare[1].fare.value,
            peak_hour_2_active_status: rowData.additional.peakFare[1].status,
          });
          this.nightHourDetailsForm.patchValue({
            night_hour_start_time: new Date(
              rowData.additional.nightFare[0].from
            ).toISOString(),
            night_hour_end_time: new Date(
              rowData.additional.nightFare[0].to
            ).toISOString(),
            night_hour_fareType: rowData.additional.nightFare[0].fare.type,
            night_hour_increase_total_fare:
              rowData.additional.nightFare[0].fare.value,
            night_hour_active_status: rowData.additional.nightFare[0].status,
          });
          this.waitingTimeDetailsForm.patchValue({
            is_waiting_time_charge_applicable: rowData.waitingFare.status,
            how_much_time: rowData.waitingFare.allowedMin,
            how_much_charge: rowData.waitingFare.fare,
          });



        } else {
          this.dataFetchWhileReload();
        }
      });
  }

  dataFetchWhileReload() {
    let id = this.ActivatedRoute.snapshot.paramMap.get("id");
    if (id) {
      this.apiservice
        .CommonGetApi("creteria/pricing/" + id)
        .subscribe((res) => {
          const data = res.data.Pricing[0];
          this.dataService.setNewRowInfo(data);
        });
    }
  }

  subscribeToMenuItem() {
    this.dialogObservable = this.menuService
      .onItemClick()
      .subscribe((event) => {
        if (
          event.item.title === this.translate.instant("PRICING.DELETEPRICING")
        ) {
          this.openDeleteDialog(this.deleteDialog);
        }
      });
  }

  goBackBtn() {
    this.location.back();
  }

  addOrEditService() {
    0;
    if (this.fareDetailsForm.invalid) {
      this.fareDetailsForm.markAllAsTouched();
    } else {
      const formData = new FormData();
      formData.append("serviceId", this.fareDetailsForm.value.servicetype);
      formData.append("currencyId", this.fareDetailsForm.value.currency);
      formData.append("serviceAreaId", this.fareDetailsForm.value.serviceAvailableCities);
      formData.append("baseFare", this.fareDetailsForm.value.base_fee);
      formData.append("bookingFare", this.fareDetailsForm.value.booking_fee);
      formData.append("minimumFare", this.fareDetailsForm.value.minimum_fee);
      formData.append("fare[type]", this.fareDetailsForm.value.fareType);
      formData.append("fare[value]", this.fareDetailsForm.value.fareValue);
      formData.append(
        "timeFare",
        this.fareDetailsForm.value.time_min_rate_for_running
      );
      formData.append("commision", this.fareDetailsForm.value.commission);

      formData.append(
        "additional[pickupFare][status]",
        this.driverConveyanceForm.value.is_conveyance_charge_needed
      );
      formData.append(
        "additional[pickupFare][value]",
        this.driverConveyanceForm.value.conveyance_charge
      );

      formData.append(
        "taxFare[status]",
        this.taxDetailsForm.value.is_tax_applicable
      );
      formData.append("taxFare[fare]", this.taxDetailsForm.value.tax);

      formData.append(
        "cancelationFare[partner]",
        this.cancellationDetailsForm.value.cancellation_charge_for_driver
      );
      formData.append(
        "cancelationFare[customer]",
        this.cancellationDetailsForm.value.cancellation_charge_for_rider
      );

      formData.append(
        "additional[peakFare][0][from]",
        this.peakHourDetailsForm.value.peak_hour_1_start_time
      );
      formData.append(
        "additional[peakFare][0][to]",
        this.peakHourDetailsForm.value.peak_hour_1_end_time
      );
      formData.append(
        "additional[peakFare][0][fare][type]",
        this.peakHourDetailsForm.value.peak_hour_1_fareType
      );
      formData.append(
        "additional[peakFare][0][fare][value]",
        this.peakHourDetailsForm.value.peak_hour_1_increase_total_fare
      );
      formData.append(
        "additional[peakFare][0][status]",
        this.peakHourDetailsForm.value.peak_hour_1_active_status
      );
      formData.append(
        "additional[peakFare][1][from]",
        this.peakHourDetailsForm.value.peak_hour_2_start_time
      );
      formData.append(
        "additional[peakFare][1][to]",
        this.peakHourDetailsForm.value.peak_hour_2_end_time
      );
      formData.append(
        "additional[peakFare][1][fare][type]",
        this.peakHourDetailsForm.value.peak_hour_2_fareType
      );
      formData.append(
        "additional[peakFare][1][fare][value]",
        this.peakHourDetailsForm.value.peak_hour_2_increase_total_fare
      );
      formData.append(
        "additional[peakFare][1][status]",
        this.peakHourDetailsForm.value.peak_hour_2_active_status
      );

      formData.append(
        "additional[nightFare][0][from]",
        this.nightHourDetailsForm.value.night_hour_start_time
      );
      formData.append(
        "additional[nightFare][0][to]",
        this.nightHourDetailsForm.value.night_hour_end_time
      );
      formData.append(
        "additional[nightFare][0][fare][type]",
        this.nightHourDetailsForm.value.night_hour_fareType
      );
      formData.append(
        "additional[nightFare][0][fare][value]",
        this.nightHourDetailsForm.value.night_hour_increase_total_fare
      );
      formData.append(
        "additional[nightFare][0][status]",
        this.nightHourDetailsForm.value.night_hour_active_status
      );

      formData.append(
        "waitingFare[status]",
        this.waitingTimeDetailsForm.value.is_waiting_time_charge_applicable
      );
      formData.append(
        "waitingFare[allowedMin]",
        this.waitingTimeDetailsForm.value.how_much_time
      );
      formData.append(
        "waitingFare[fare]",
        this.waitingTimeDetailsForm.value.how_much_charge
      );
      if (this.fareDetailsForm.value.id) {
        this.apiservice
          .CommonPutApi(
            "creteria/pricing/" + this.fareDetailsForm.value.id,
            formData
          )
          .subscribe({
            next: (res) => {
              this.toasterService.success(res.type, res.message);
            },
            error: (error) => {
              this.toasterService.danger(error.error.message);
            },
          });
      } else {
        this.apiservice.CommonPostApi(formData, "creteria/pricing").subscribe({
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

  deletePricing() {
    this.apiservice
      .CommonDeleteApi(this.fareDetailsForm.value.id, "creteria/pricing")
      .subscribe((res) => {
        const data = res.data;
        this.toasterService.success(res.type, data.message);
        this.goBackBtn();
      });
  }

  openDeleteDialog(dialog: TemplateRef<any>) {
    this.priceingDeleteDialogClose = this.dialogService.open(dialog, {
      autoFocus: false,
      closeOnBackdropClick:
        featuresSettings.Nb_dialogbox_close_while_click_outside,
    });
  }

  deletePopUpData = {
    title: this.translate.instant("PRICING.DELETEPRICING"),
    data:
      this.translate.instant("COMMON.AREYOUSURE") +
      " " +
      this.translate.instant("PRICING.PRICING"),
  };

  closeDeletePopup(event: string) {
    if (event === "close") {
      this.priceingDeleteDialogClose.close();
    } else {
      this.deletePricing();
    }
  }
}
