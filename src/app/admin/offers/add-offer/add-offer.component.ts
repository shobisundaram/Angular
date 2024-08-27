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
import { formatDate } from "@angular/common";
import { ApiService } from "../../api.service";
import {
  NbDialogService,
  NbMenuService,
  NbToastrService,
} from "@nebular/theme";
import { Location } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";
import { Offer } from "../../../@theme/interface/interface";
import * as moment from "moment";

@Component({
  selector: "ngx-add-offer",
  templateUrl: "./add-offer.component.html",
  styleUrls: ["./add-offer.component.scss"],
})
export class AddOfferComponent implements OnInit, OnDestroy {
  @ViewChild("DeleteDialog") deleteDialog: TemplateRef<any>;
  items = [
    {
      icon: "trash-2",
      title: this.translate.instant("OFFERS.DELETEOFFER"),
    },
  ];

  subscribeToMenuItem() {
    this.dialogObservable = this.menuService
      .onItemClick()
      .subscribe((event) => {
        if (event.item.title === this.translate.instant("OFFERS.DELETEOFFER")) {
          this.openDeleteDialog(this.deleteDialog);
        }
      });
  }

  offerDeleteDialogClose: import("@nebular/theme").NbDialogRef<any>;
  baseurl = environment.BASEURL;
  offersForm: FormGroup;
  serviceAvailableCities: any;
  coupons: any;
  zero_or_one = CommonData.zero_or_one;
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

  constructor(
    private dataService: DataService,
    private apiservice: ApiService,
    private toasterService: NbToastrService,
    private location: Location,
    public translate: TranslateService,
    private dialogService: NbDialogService,
    private menuService: NbMenuService,
    private ActivatedRoute: ActivatedRoute,

  ) { 

  }
  dialogObservable: any;

  ngOnInit(): void {
    this.initializeOffersForm();
    this.patchOffersForm();
    this.subscribeToMenuItem();
  }

  ngOnDestroy(): void {
    this.dialogObservable.unsubscribe();
    this.dataServiceSubscition.unsubscribe();
    if (this.offerDeleteDialogClose) {
      this.offerDeleteDialogClose.close();
    }
  }

  initializeOffersForm() {
    this.offersForm = new FormGroup({
      id: new FormControl(""),
      service_available_city: new FormControl(null, Validators.required),
      start: new FormControl(this.toDay, Validators.required),
      end: new FormControl(this.toDay, Validators.required),
      title: new FormControl("", Validators.required),
      description: new FormControl("", Validators.required),
      image: new FormControl("", Validators.required),
      fileSource: new FormControl(""),
      is_coupon: new FormControl(""),
      coupon: new FormControl(null, Validators.required),
    });
    this.apiservice.CommonGetApi("creteria/serviceArea/list").subscribe({
      next: (res) => {
        this.serviceAvailableCities = res.data.serviceArea;
      },
      error: (error) => {
        this.toasterService.danger(error.error.message);
      },
    });
    this.apiservice.CommonGetApi("creteria/coupon").subscribe({
      next: (res) => {
        this.coupons = res.data.coupons;
      },
      error: (error) => {
        this.toasterService.danger(error.error.message);
      },
    });
  }

  get service_available_city() {
    return this.offersForm.get("service_available_city");
  }
  get start() {
    return this.offersForm.get("start");
  }
  get end() {
    return this.offersForm.get("end");
  }
  get title() {
    return this.offersForm.get("title");
  }
  get description() {
    return this.offersForm.get("description");
  }
  get image() {
    return this.offersForm.get("image");
  }
  get is_coupon() {
    return this.offersForm.get("is_coupon");
  }
  get coupon() {
    return this.offersForm.get("coupon");
  }

  patchOffersForm(): void {
    this.dataServiceSubscition = this.dataService
      .getNewRowInfo()
      .subscribe((data) => {
        const rowData: Offer = data;
        if (JSON.stringify(rowData) !== "{}") {
          const startdate = new Date(rowData.start);
          const enddate = new Date(rowData.end);
          this.offersForm.patchValue({
            id: rowData._id,
            service_available_city: rowData.scIds,
            start: rowData.start,
            end: rowData.end,
            title: rowData.title,
            description: rowData.description,
            image: this.baseurl + rowData.offerImg,
            is_coupon: rowData.hasCoupon ? 1 : 0,
            coupon: rowData.couponId,
          });
        } else {
          this.dataFetchWhileReload();
        }
      });
  }

  dataFetchWhileReload() {
    let id = this.ActivatedRoute.snapshot.paramMap.get("id");
    if (id) {
      this.apiservice.CommonGetApi("creteria/offer/" + id).subscribe((res) => {
        const data = res.data.Offer[0];
        this.dataService.setNewRowInfo(data);
      });
    }
  }

  goBackBtn() {
    this.location.back();
  }

  onChange(file: FileList) {
    let fileToUpload = file.item(0);

    let reader = new FileReader();
    reader.onload = (event: any) => {
      let imageUrl = event.target.result;

      this.offersForm.patchValue({
        image: imageUrl,
        fileSource: file[0],
      });
    };
    reader.readAsDataURL(fileToUpload);
  }

  addOrEditOffer() {
    if (this.offersForm.invalid) {
      this.offersForm.markAllAsTouched();
    } else {
      const formData = new FormData();
      // formData.append(
      //   "service_available_city",
      //   this.offersForm.value.service_available_city
      // );
      formData.append("scIds", this.offersForm.value.service_available_city);
      formData.append(
        "start",
        moment(this.offersForm.value.start, "YYYY-MM-DDTHH:mm").format(
          "YYYY-MM-DD"
        )
      );
      formData.append(
        "end",
        moment(this.offersForm.value.end, "YYYY-MM-DDTHH:mm").format(
          "YYYY-MM-DD"
        )
      );
      formData.append("title", this.offersForm.value.title);
      formData.append("description", this.offersForm.value.description);
      formData.append("file", this.offersForm.value.fileSource);
      formData.append("hasCoupon", this.offersForm.value.is_coupon);
      formData.append("couponId", this.offersForm.value.coupon);

      console.log(formData,"form dataa")

      if (this.offersForm.value.id) {
        this.apiservice
          .CommonPutApi("creteria/offer/" + this.offersForm.value.id, formData)
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
        this.apiservice.CommonPostApi(formData, "creteria/offer").subscribe({
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

  deleteOffer() {
    this.apiservice
      .CommonDeleteApi(this.offersForm.value.id, "creteria/offer")
      .subscribe((res) => {
        const data = res.data;
        this.toasterService.success(res.type, data.message);
        this.goBackBtn();
      });
  }

  openDeleteDialog(dialog: TemplateRef<any>) {
    this.offerDeleteDialogClose = this.dialogService.open(dialog, {
      autoFocus: false,
      closeOnBackdropClick:
        featuresSettings.Nb_dialogbox_close_while_click_outside,
    });
  }

  deletePopUpData = {
    title: this.translate.instant("OFFERS.DELETEOFFER"),
    data:
      this.translate.instant("COMMON.AREYOUSURE") +
      " " +
      this.translate.instant("OFFERS.OFFER"),
  };

  closeDeletePopup(event: string) {
    if (event === "close") {
      this.offerDeleteDialogClose.close();
    } else {
      this.deleteOffer();
    }
  }

  logStartDate(msg) {
    this.endMinDate = this.offersForm.value.start;
    this.offersForm.patchValue({
      end: "",
    });
  }
}
