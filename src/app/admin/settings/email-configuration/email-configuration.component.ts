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
import {
  NbDialogService,
  NbMenuService,
  NbToastrService,
} from "@nebular/theme";
import * as moment from "moment";

@Component({
  selector: "ngx-email-configuration",
  templateUrl: "./email-configuration.component.html",
  styleUrls: ["./email-configuration.component.scss"],
})
export class EmailConfigurationComponent implements OnInit, OnDestroy {
  @ViewChild("EmailUpdateDialog") EmailUpdateDialog: TemplateRef<any>;
  @ViewChild("ActivationDialog") ActivationDialog: TemplateRef<any>;
  emailItems = [
    {
      icon: "edit-2-outline",
      title: this.translate.instant("COMMON.ACTION"),
    },
    {
      icon: "checkmark-circle-2-outline",
      title: this.translate.instant("SETTINGS.ACTIVE"),
    },
  ];
  needEmailgateways: any;
  emailGateway: any;
  emailConfigDialogClose: import("@nebular/theme").NbDialogRef<any>;
  activationDialogClose: import("@nebular/theme").NbDialogRef<any>;

  subscribeToMenuItem() {
    this.dialogObservable = this.menuService
      .onItemClick()
      .subscribe((event) => {
        if (event.tag && event.item.title == "Action") {
          let result = this.needEmailgateways.filter(
            (el) => el.indexName == event.tag
          );
          this.openEmailUpdateDialog(this.EmailUpdateDialog, result[0]);
        }
        if (event.tag && event.item.title == "Active") {
          const objectData = {
            status: event.item.title === "Active" ? true : false,
            emailGateway: event.tag,
          };
          this.apiservice
            .CommonPutApi("common/config/activemailgateway", objectData)
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
    this.getEmailConfigApi();
  }

  ngOnDestroy(): void {
    this.dialogObservable.unsubscribe();
    if (this.emailConfigDialogClose) this.emailConfigDialogClose.close();
    if (this.activationDialogClose) this.activationDialogClose.close();
  }

  goBackBtn() {
    this.location.back();
  }

  emailActions(status) {
    if (status == true) {
      this.emailItems = [
        {
          icon: "edit-2-outline",
          title: this.translate.instant("COMMON.ACTION"),
        },
      ];
    } else if (status == false) {
      this.emailItems = [
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
  onChangeForEmailConfig(event, name, type) {
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

  openEmailUpdateDialog(dialog: TemplateRef<any>, dialogData) {
    this.emailConfigDialogClose = this.dialogService.open(dialog, {
      context: dialogData,
      autoFocus: false,
      closeOnBackdropClick:
        featuresSettings.Nb_dialogbox_close_while_click_outside,
    });
    this.emailGateway = dialogData.indexName;
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
    setTimeout(() => this.getEmailConfigApi(), 2000);
  }

  emailConfigUpdate() {
    const dataObject = {};
    if (this.emailGateway) {
      this.test["mailGateway"] = this.emailGateway;
    }
    for (const property in this.test) {
      if (this.test.hasOwnProperty(property)) {
        dataObject[property] = this.test[property];
      }
    }
    this.apiservice
      .CommonPostApi(dataObject, "common/config/setmailconfig")
      .subscribe({
        next: (res) => {
          const data = res.data;
          this.toasterService.success(res.type, data.message);
          this.emailConfigDialogClose.close();
          this.test = {};
        },
        error: (error) => {
          this.toasterService.danger(error.error.message);
        },
      });
  }

  getEmailConfigApi() {
    this.apiservice
      .CommonGetApi("common/config/getmailconfig")
      .subscribe((res) => {
        this.needEmailgateways = res.data.enabledGateway;
        if (this.activationDialogClose) this.activationDialogClose.close();
      });
  }
}
