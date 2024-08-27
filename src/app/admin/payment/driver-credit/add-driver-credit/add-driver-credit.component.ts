import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { DataService } from "../../../data.service";
import {
  environment,
  featuresSettings,
} from "../../../../../environments/environment";
import { ApiService } from "../../../api.service";
import { NbToastrService } from "@nebular/theme";
import { Location } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "ngx-add-driver-credit",
  templateUrl: "./add-driver-credit.component.html",
  styleUrls: ["./add-driver-credit.component.scss"],
})
export class AddDriverCreditComponent implements OnInit, OnDestroy {
  baseurl = environment.BASEURL;
  partnerCreditForm: FormGroup;
  dataServiceSubscition: any;
  partners: any;
  paymentTypeDropDownData: any[] = featuresSettings.paymentType;

  constructor(
    private dataService: DataService,
    private apiservice: ApiService,
    private toasterService: NbToastrService,
    private location: Location,
    public translate: TranslateService,
    private ActivatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.initializePartnerCreditForm();
    // this.patchAddPartnerCreditForm();
    this.autoTransactionId();
  }

  ngOnDestroy(): void {
    // this.dialogObservable.unsubscribe();
    // this.dataServiceSubscition.unsubscribe();
  }

  initializePartnerCreditForm() {
    this.partnerCreditForm = new FormGroup({
      id: new FormControl(""),
      transactionId: new FormControl("", Validators.required),
      partner: new FormControl(null, Validators.required),
      amount: new FormControl("0", Validators.required),
      paymentType: new FormControl(null, Validators.required),
      description: new FormControl("", Validators.required),
      paymentDate: new FormControl(null, Validators.required),
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

  get transactionId() {
    return this.partnerCreditForm.get("transactionId");
  }
  get partner() {
    return this.partnerCreditForm.get("partner");
  }
  get amount() {
    return this.partnerCreditForm.get("amount");
  }
  get paymentType() {
    return this.partnerCreditForm.get("paymentType");
  }
  get description() {
    return this.partnerCreditForm.get("description");
  }
  get paymentDate() {
    return this.partnerCreditForm.get("paymentDate");
  }

  dataFetchWhileReload() {
    let id = this.ActivatedRoute.snapshot.paramMap.get("id");
    if (id) {
      this.apiservice.CommonGetApi("common/customer/" + id).subscribe((res) => {
        const data = res.data.customer[0];
        this.dataService.setNewRowInfo(data);
      });
    }
  }

  goBackBtn() {
    this.location.back();
  }

  addOrEditPartnerCredit() {
    if (this.partnerCreditForm.invalid) {
      this.partnerCreditForm.markAllAsTouched();
    } else {
      const formData = new FormData();
      formData.append(
        "transactionId",
        this.partnerCreditForm.value.transactionId
      );
      formData.append("partner", this.partnerCreditForm.value.partner);
      formData.append("amount", this.partnerCreditForm.value.amount);
      formData.append("paymentType", this.partnerCreditForm.value.paymentType);
      formData.append("description", this.partnerCreditForm.value.description);
      formData.append("paymentDate", this.partnerCreditForm.value.paymentDate);
      if (this.partnerCreditForm.value.id) {
        this.apiservice
          .CommonPutApi(
            "common/customer/" + this.partnerCreditForm.value.id,
            formData
          )
          .subscribe({
            next: (res) => {
              const data = res.data;
              // this.partnerCreditForm.patchValue({
              //   image: this.baseurl + data.onboarding.image,
              // });
              this.toasterService.success(res.type, data.message);
            },
            error: (error) => {
              this.toasterService.danger(error.error.message);
            },
          });
      } else {
        this.apiservice.CommonPostApi(formData, "common/customer").subscribe({
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

  deletePartnerCredit() {
    this.apiservice
      .CommonDeleteApi(this.partnerCreditForm.value.id, "common/customer")
      .subscribe((res) => {
        const data = res.data;
        this.toasterService.success(res.type, data.message);
        this.goBackBtn();
      });
  }

  autoTransactionId(): void {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (let i = 0; i < 7; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    this.partnerCreditForm.patchValue({
      transactionId: text,
    });
  }
}
