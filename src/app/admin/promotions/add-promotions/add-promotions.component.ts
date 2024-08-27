import {
  Component,
  OnInit,
  OnDestroy,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { DataService } from "../../data.service";
import {
  environment,
  CommonData,
  featuresSettings,
} from "../../../../environments/environment";
import { ApiService } from "../../api.service";
import {
  NbDialogService,
  NbMenuService,
  NbToastrService,
} from "@nebular/theme";
import { Location } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";
import { Coupons } from "../../../@theme/interface/interface";
import * as moment from "moment";
import { DatePipe } from "@angular/common";

@Component({
  selector: "ngx-add-promotions",
  templateUrl: "./add-promotions.component.html",
  styleUrls: ["./add-promotions.component.scss"],
})
export class AddPromotionsComponent implements OnInit, OnDestroy {
  @ViewChild("DeleteDialog") deleteDialog: TemplateRef<any>;
  items = [
    {
      icon: "trash-2",
      title: this.translate.instant("COUPONS.DELETECOUPON"),
    },
  ];

  subscribeToMenuItem() {
    this.dialogObservable = this.menuService
      .onItemClick()
      .subscribe((event) => {
        if (
          event.item.title === this.translate.instant("COUPONS.DELETECOUPON")
        ) {
          this.openDeleteDialog(this.deleteDialog);
        }
      });
  }

  couponCodeDeleteDialogClose: import("@nebular/theme").NbDialogRef<any>;

  baseurl = environment.BASEURL;
  couponCodeForm: FormGroup;
  offerTypes = CommonData.offerTypes;
  statu = CommonData.status;
  tripTypes = CommonData.tripType;
  serviceAvailableCities: any;
  // categorys = CommonData.category;
  apply_types = CommonData.apply_type;
  dataServiceSubscition: any;
  toDay: Date = new Date();
  startMinDate: Date = new Date(
    this.toDay.getFullYear(),
    this.toDay.getMonth(),
    this.toDay.getDate()
  );
  endMinDate: Date = new Date(
    this.toDay.getFullYear(),
    this.toDay.getMonth(),
    this.toDay.getDate()
  );
  minTime: Date = new Date(
    this.toDay.getFullYear(),
    this.toDay.getMonth() + 1,
    this.toDay.getDate(),
    9,
    0
  );

  constructor(
    private dataService: DataService,
    private apiservice: ApiService,
    private toasterService: NbToastrService,
    private location: Location,
    public translate: TranslateService,
    private dialogService: NbDialogService,
    private menuService: NbMenuService,
    private ActivatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
  ) {}
  dialogObservable: any;

  ngOnInit(): void {
    this.initializeCouponCodeForm();
    this.patchCouponCodeForm();
    this.subscribeToMenuItem();
    if (this.couponCodeForm.value.id == "" || undefined) {
      this.autoGenerateCode();
    }
  }

  ngOnDestroy(): void {
    this.dialogObservable.unsubscribe();
    this.dataServiceSubscition.unsubscribe();
    if (this.couponCodeDeleteDialogClose) {
      this.couponCodeDeleteDialogClose.close();
    }
  }

  initializeCouponCodeForm() {
    this.couponCodeForm = new FormGroup({
      id: new FormControl(""),
      generateCode: new FormControl("", Validators.required),
      offer_type: new FormControl(null, Validators.required),
      offer_type_value: new FormControl(0, Validators.required),
      // percentage: new FormControl(0, Validators.required),
      start_date: new FormControl(this.toDay, Validators.required),
      end_date: new FormControl(this.toDay, Validators.required),
      start_time: new FormControl("", Validators.required),
      end_time: new FormControl("", Validators.required),
      limit: new FormControl(0, Validators.required),
      user_limit: new FormControl(0, Validators.required),
      offer_value: new FormControl(0, Validators.required),
      offer_limit: new FormControl(0, Validators.required),
      service_available_city: new FormControl(null, Validators.required),
      trip_type: new FormControl(null, Validators.required),
      status: new FormControl(null, Validators.required),
      // category: new FormControl(null, Validators.required),
      apply_type: new FormControl(null, Validators.required),
    });
    this.apiservice.CommonGetApi("creteria/serviceArea/list").subscribe({
      next: (res) => {
        this.serviceAvailableCities = res.data.serviceArea;
      },
      error: (error) => {
        this.toasterService.danger(error.error.message);
      },
    });
  }

  get generateCode() {
    return this.couponCodeForm.get("generateCode");
  }
  get offer_type() {
    return this.couponCodeForm.get("offer_type");
  }
  get offer_type_value() {
    return this.couponCodeForm.get("offer_type_value");
  }
  // get percentage() {
  //   return this.couponCodeForm.get("percentage");
  // }
  get start_date() {
    return this.couponCodeForm.get("start_date");
  }
  get end_date() {
    return this.couponCodeForm.get("end_date");
  }
  get start_time() {
    return this.couponCodeForm.get("start_time");
  }
  get end_time() {
    return this.couponCodeForm.get("end_time");
  }
  get limit() {
    return this.couponCodeForm.get("limit");
  }
  get user_limit() {
    return this.couponCodeForm.get("user_limit");
  }
  get offer_value() {
    return this.couponCodeForm.get("offer_value");
  }
  get offer_limit() {
    return this.couponCodeForm.get("offer_limit");
  }
  get service_available_city() {
    return this.couponCodeForm.get("service_available_city");
  }
  get trip_type() {
    return this.couponCodeForm.get("trip_type");
  }
  get status() {
    return this.couponCodeForm.get("status");
  }
  // get category() {
  //   return this.couponCodeForm.get("category");
  // }
  get apply_type() {
    return this.couponCodeForm.get("apply_type");
  }

  patchCouponCodeForm(): void {
    this.dataServiceSubscition = this.dataService
      .getNewRowInfo()
      .subscribe((data) => {
        const Data = data;
        const rowData: Coupons = data;
        if (JSON.stringify(rowData) !== "{}") {
          this.couponCodeForm.patchValue({
            id: rowData._id,
            generateCode: rowData.code,
            offer_type: Data.fare.type,
            offer_type_value: Data.fare.value,
            // percentage: 0,
            start_date: rowData.start,
            end_date: rowData.end,
            start_time: this.convertTimeToIsoFormat(rowData.startTime),
            end_time: this.convertTimeToIsoFormat(rowData.endTime),
            limit: rowData.limit,
            user_limit: rowData.userLimit,
            offer_value: rowData.offerValue,
            offer_limit: rowData.offerLimit,
            service_available_city: rowData.scIds,
            trip_type: rowData.tripType,
            status: rowData.status,
            // category: rowData.category,
            apply_type: rowData.applyType,
          });
        } else {
          this.dataFetchWhileReload();
        }
      });
  }

  convertTimeToIsoFormat(timeString) {
    const today = new Date();
    const [hours, minutes] = timeString.split(":");
    today.setHours(+hours, +minutes, 0, 0);
    return this.datePipe.transform(today, "YYYY-MM-ddTHH:mm:ss.SSS");
  }

  dataFetchWhileReload() {
    let id = this.ActivatedRoute.snapshot.paramMap.get("id");
    if (id) {
      this.apiservice.CommonGetApi("creteria/coupon/" + id).subscribe((res) => {
        const data = res.data.coupons[0];
        this.dataService.setNewRowInfo(data);
      });
    }
  }

  goBackBtn() {
    this.location.back();
  }

  addOrEditCouponCode() {
    if (this.couponCodeForm.invalid) {
      console.log("123", this.couponCodeForm);

      this.couponCodeForm.markAllAsTouched();
    } else {
      const fare = {
        type: this.couponCodeForm.value.offer_type,
        value: this.couponCodeForm.value.offer_type_value,
      };

      const payload = {
        code: this.couponCodeForm.value.generateCode,
        fare: fare,
        // percentage: this.couponCodeForm.value.percentage,

        start: moment(
          this.couponCodeForm.value.start_date,
          "YYYY-MM-DDTHH:mm"
        ).format("YYYY-MM-DD"),
        end: moment(
          this.couponCodeForm.value.end_date,
          "YYYY-MM-DDTHH:mm"
        ).format("YYYY-MM-DD"),
        startTime: moment(
          this.couponCodeForm.value.start_time,
          "YYYY-MM-DDTHH:mm"
        ).format("HH:mm"),
        endTime: moment(
          this.couponCodeForm.value.end_time,
          "YYYY-MM-DDTHH:mm"
        ).format("HH:mm"),

        limit: this.couponCodeForm.value.limit,
        userLimit: this.couponCodeForm.value.user_limit,
        offerValue: this.couponCodeForm.value.offer_value,
        offerLimit: this.couponCodeForm.value.offer_limit,

        scIds: this.couponCodeForm.value.service_available_city,
        tripType: this.couponCodeForm.value.trip_type,
        status: this.couponCodeForm.value.status,
        // category: this.couponCodeForm.value.category,
        applyType: this.couponCodeForm.value.apply_type,
      };

      if (this.couponCodeForm.value.id) {
        this.apiservice
          .CommonPutApi(
            "creteria/coupon/" + this.couponCodeForm.value.id,
            payload
          )
          .subscribe({
            next: (res) => {
              const data = res.data;
              // this.couponCodeForm.patchValue({
              //   image: this.baseurl + data.onboarding.image,
              // });
              this.toasterService.success(res.type, data.message);
            },
            error: (error) => {
              this.toasterService.danger(error.error.message);
            },
          });
      } else {
        this.apiservice.CommonPostApi(payload, "creteria/coupon").subscribe({
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

  deleteCouponCode() {
    this.apiservice
      .CommonDeleteApi(this.couponCodeForm.value.id, "creteria/coupon")
      .subscribe((res) => {
        const data = res.data;
        this.toasterService.success(res.type, data.message);
        this.goBackBtn();
      });
  }

  autoGenerateCode(): void {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (let i = 0; i < 7; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    this.couponCodeForm.patchValue({
      generateCode: text,
    });
  }

  openDeleteDialog(dialog: TemplateRef<any>) {
    this.couponCodeDeleteDialogClose = this.dialogService.open(dialog, {
      autoFocus: false,
      closeOnBackdropClick:
        featuresSettings.Nb_dialogbox_close_while_click_outside,
    });
  }

  deletePopUpData = {
    title: this.translate.instant("COUPONS.DELETECOUPON"),
    data:
      this.translate.instant("COMMON.AREYOUSURE") +
      " " +
      this.translate.instant("COUPONS.COUPON"),
  };

  closeDeletePopup(event: string) {
    if (event === "close") {
      this.couponCodeDeleteDialogClose.close();
    } else {
      this.deleteCouponCode();
    }
  }

  logStartDate(msg) {
    this.endMinDate = this.couponCodeForm.value.start_date;
    this.couponCodeForm.patchValue({
      end_date: "",
    });
  }

  logStartTime(msg) {
    this.minTime = this.couponCodeForm.value.start_time;
    this.couponCodeForm.patchValue({
      end_time: "",
    });
  }
}
