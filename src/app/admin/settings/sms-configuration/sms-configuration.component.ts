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
  selector: "ngx-sms-configuration",
  templateUrl: "./sms-configuration.component.html",
  styleUrls: ["./sms-configuration.component.scss"],
})
export class SmsConfigurationComponent implements OnInit, OnDestroy {
  @ViewChild("SmsUpdateDialog") SmsUpdateDialog: TemplateRef<any>;
  @ViewChild("ActivationDialog") ActivationDialog: TemplateRef<any>;
  smsItems = [
    {
      icon: "edit-2-outline",
      title: this.translate.instant("COMMON.ACTION"),
    },
    {
      icon: "checkmark-circle-2-outline",
      title: this.translate.instant("SETTINGS.ACTIVE"),
    },
  ];
  needSmsgateways: any;
  smsGateway: any;
  smsConfigDialogClose: import("@nebular/theme").NbDialogRef<any>;
  activationDialogClose: import("@nebular/theme").NbDialogRef<any>;

  subscribeToMenuItem() {
    this.dialogObservable = this.menuService
      .onItemClick()
      .subscribe((event) => {
        if (event.tag && event.item.title == "Action") {
          let result = this.needSmsgateways.filter(
            (el) => el.indexName == event.tag
          );
          this.openSmsUpdateDialog(this.SmsUpdateDialog, result[0]);
        }
        if (event.tag && event.item.title == "Active") {
          const objectData = {
            status: event.item.title === "Active" ? true : false,
            smsGateway: event.tag,
          };
          this.apiservice
            .CommonPutApi("common/config/activesmsgateway", objectData)
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
    this.getSmsConfigApi();
  }

  ngOnDestroy(): void {
    this.dialogObservable.unsubscribe();
    if (this.smsConfigDialogClose) this.smsConfigDialogClose.close();
    if (this.activationDialogClose) this.activationDialogClose.close();
  }

  goBackBtn() {
    this.location.back();
  }

  smsActions(status) {
    if (status == true) {
      this.smsItems = [
        {
          icon: "edit-2-outline",
          title: this.translate.instant("COMMON.ACTION"),
        },
      ];
    } else if (status == false) {
      this.smsItems = [
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
  onChangeForSmsConfig(event, name, type) {
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

  openSmsUpdateDialog(dialog: TemplateRef<any>, dialogData) {
    this.smsConfigDialogClose = this.dialogService.open(dialog, {
      context: dialogData,
      autoFocus: false,
      closeOnBackdropClick:
        featuresSettings.Nb_dialogbox_close_while_click_outside,
    });
    this.smsGateway = dialogData.indexName;
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
    setTimeout(() => this.getSmsConfigApi(), 2000);
  }

  smsConfigUpdate() {
    const dataObject = {};
    if (this.smsGateway) {
      this.test["smsGateway"] = this.smsGateway;
    }
    for (const property in this.test) {
      if (this.test.hasOwnProperty(property)) {
        dataObject[property] = this.test[property];
      }
    }
    this.apiservice
      .CommonPostApi(dataObject, "common/config/setsmsconfig")
      .subscribe({
        next: (res) => {
          const data = res.data;
          this.toasterService.success(res.type, data.message);
          this.smsConfigDialogClose.close();
          this.test = {};
        },
        error: (error) => {
          this.toasterService.danger(error.error.message);
        },
      });
  }

  getSmsConfigApi() {
    this.apiservice
      .CommonGetApi("common/config/getsmsconfig")
      .subscribe((res) => {
        this.needSmsgateways = res.data.enabledGateway;
        if (this.activationDialogClose) this.activationDialogClose.close();
      });
  }
}
