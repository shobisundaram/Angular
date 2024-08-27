import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import {
  environment,
  featuresSettings,
} from "../../../../environments/environment";
import { Location } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";
import { ApiService } from "../../api.service";
import * as moment from "moment";
import {
  NbDialogService,
  NbMenuService,
  NbToastrService,
} from "@nebular/theme";

@Component({
  selector: "ngx-payment-gateway-configuration",
  templateUrl: "./payment-gateway-configuration.component.html",
  styleUrls: ["./payment-gateway-configuration.component.scss"],
})
export class PaymentGatewayConfigurationComponent implements OnInit, OnDestroy {
  @ViewChild("PaymentUpdateDialog") PaymentUpdateDialog: TemplateRef<any>;
  @ViewChild("ActivationDialog") ActivationDialog: TemplateRef<any>;
  paymentItems = [
    {
      icon: "edit-2-outline",
      title: this.translate.instant("COMMON.ACTION"),
    },
    {
      icon: "checkmark-circle-2-outline",
      title: this.translate.instant("SETTINGS.ACTIVE"),
    },
  ];
  needPaymentgateways: any;
  paymentGateway: any;
  paymentConfigDialogClose: import("@nebular/theme").NbDialogRef<any>;
  activationDialogClose: import("@nebular/theme").NbDialogRef<any>;

  subscribeToMenuItem() {
    this.dialogObservable = this.menuService
      .onItemClick()
      .subscribe((event) => {
        if (event.tag && event.item.title == "Action") {
          let result = this.needPaymentgateways.filter(
            (el) => el.indexName == event.tag
          );
          this.openPaymentUpdateDialog(this.PaymentUpdateDialog, result[0]);
        }
        if (event.tag && event.item.title == "Active") {
          const objectData = {
            status: event.item.title === "Active" ? true : false,
            paymentGateway: event.tag,
          };
          this.apiservice
            .CommonPutApi("common/config/activepaymentgateway", objectData)
            .subscribe({
              next: (res) => {
                this.toasterService.success(res.type, res.message);
                this.openActivationDialog(this.ActivationDialog);
              },
              error: (error) => {
                this.toasterService.danger(error.error.message);
              },
            });
        }
      });
  }
  baseurl = environment.BASEURL;

  constructor(
    private location: Location,
    public translate: TranslateService,
    private apiservice: ApiService,
    private menuService: NbMenuService,
    private dialogService: NbDialogService,
    private toasterService: NbToastrService
  ) {}
  dialogObservable: any;

  ngOnInit(): void {
    this.subscribeToMenuItem();
    this.getPaymentConfigApi();
  }

  ngOnDestroy(): void {
    this.dialogObservable.unsubscribe();
    if (this.paymentConfigDialogClose) this.paymentConfigDialogClose.close();
    if (this.activationDialogClose) this.activationDialogClose.close();
  }

  goBackBtn() {
    this.location.back();
  }

  paymentActions(status) {
    if (status == true) {
      this.paymentItems = [
        {
          icon: "edit-2-outline",
          title: this.translate.instant("COMMON.ACTION"),
        },
      ];
    } else if (status == false) {
      this.paymentItems = [
        {
          icon: "edit-2-outline",
          title: this.translate.instant("COMMON.ACTION"),
        },
        {
          icon: "checkmark-circle-2-outline",
          title: this.translate.instant("SETTINGS.ACTIVE"),
        },
      ];
    }
  }

  test = {};
  onChangeForPaymentConfig(event, name, type) {
    if (type == "image") {
      this.test[name] = event.target.files[0];
    } else if (type == "date") {
      let date;
      date = moment(event).format("YYYY-MM-DD");
      this.test[name] = date;
    } else if (type == "string") {
      this.test[name] = event;
    }
  }

  openPaymentUpdateDialog(dialog: TemplateRef<any>, dialogData) {
    this.paymentConfigDialogClose = this.dialogService.open(dialog, {
      context: dialogData,
      autoFocus: false,
      closeOnBackdropClick:
        featuresSettings.Nb_dialogbox_close_while_click_outside,
    });
    this.paymentGateway = dialogData.indexName;
  }

  activationDialogData = {
    data: this.translate.instant("SETTINGS.WAITING_FOR_RES"),
  };

  openActivationDialog(dialog: TemplateRef<any>) {
    this.activationDialogClose = this.dialogService.open(dialog, {
      context: this.activationDialogData,
      autoFocus: false,
      closeOnBackdropClick:
        featuresSettings.Nb_dialogbox_close_while_click_outside,
    });
    setTimeout(() => this.getPaymentConfigApi(), 2000);
  }

  paymentConfigUpdate() {
    const dataObject = {};
    if (this.paymentGateway) {
      this.test["paymentGateway"] = this.paymentGateway;
    }
    for (const property in this.test) {
      if (this.test.hasOwnProperty(property)) {
        dataObject[property] = this.test[property];
      }
    }
    this.apiservice
      .CommonPostApi(dataObject, "common/config/setpaymentconfig")
      .subscribe({
        next: (res) => {
          const data = res.data;
          this.toasterService.success(res.type, data.message);
          this.paymentConfigDialogClose.close();
          this.test = {};
        },
        error: (error) => {
          this.toasterService.danger(error.error.message);
        },
      });
  }

  getPaymentConfigApi() {
    this.apiservice
      .CommonGetApi("common/config/getpaymentconfig")
      .subscribe((res) => {
        this.needPaymentgateways = res.data.enabledGateway;
        if (this.activationDialogClose) this.activationDialogClose.close();
      });
  }
}
