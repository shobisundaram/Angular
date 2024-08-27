import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { environment } from "../../../../environments/environment";
import { Location } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";
import { ApiService } from "../../api.service";
import { NbToastrService } from "@nebular/theme";
// import { General_Settings } from "../../../@theme/interface/interface";

@Component({
  selector: "ngx-general-settings",
  templateUrl: "./general-settings.component.html",
  styleUrls: ["./general-settings.component.scss"],
})
export class GeneralSettingsComponent implements OnInit {
  baseurl = environment.BASEURL;
  generalSettingsForm: FormGroup;
  getGeneralSettingsData: any;
  constructor(
    private location: Location,
    public translate: TranslateService,
    private ref: ChangeDetectorRef,
    private apiservice: ApiService,
    private toasterService: NbToastrService
  ) { }

  ngOnInit(): void {
    this.initializeGeneralSettingsForm();
    this.apiservice.CommonGetApi("common/configuration").subscribe({
      next: (res) => {
        this.getGeneralSettingsData = res.data.data;
        this.patchGeneralSettingsForm();
      },
      error: (error) => {
        this.toasterService.danger(error.error.message);
      },
    });
  }

  initializeGeneralSettingsForm() {
    this.generalSettingsForm = new FormGroup({
      name: new FormControl(""),
      language: new FormControl(""),
      phoneCode: new FormControl(""),
      currency: new FormControl(""),
      baseurl: new FormControl(""),
      mapId: new FormControl(""),
      websiteKey: new FormControl(""),
      serverKey: new FormControl(""),
      androidKey: new FormControl(""),
      iosKey: new FormControl(""),
      logoPath: new FormControl(""),
      faviconPath: new FormControl(""),
      fileSource1: new FormControl(""),
      fileSource2: new FormControl(""),
      shareTrip: new FormControl(""),
      androidCustomer: new FormControl(""),
      androidPartner: new FormControl(""),
      iosCustomer: new FormControl(""),
      iosPartner: new FormControl("")
    });
  }

  patchGeneralSettingsForm() {
    const rowData = this.getGeneralSettingsData;
    this.generalSettingsForm.patchValue({
      name: rowData.app.name,
      language: rowData.app.language,
      phoneCode: rowData.app.phoneCode,
      currency: rowData.app.currency,
      baseurl: rowData.app.baseurl,
      // shareTrip: rowData.app.shareTrip,
      mapId: rowData.mapConfig.mapId,
      websiteKey: rowData.mapConfig.websiteKey,
      serverKey: rowData.mapConfig.serverKey,
      androidKey: rowData.mapConfig.androidKey,
      iosKey: rowData.mapConfig.iosKey,
      logoPath: this.baseurl + rowData.app.logo,
      faviconPath: this.baseurl + rowData.app.favicon,
      shareTrip: rowData.productLinks.shareTrip,
      androidCustomer: rowData.productLinks.androidCustomer,
      androidPartner: rowData.productLinks.androidPartner,
      iosCustomer: rowData.productLinks.iosCustomer,
      iosPartner: rowData.productLinks.iosPartner
    });
  }

  onChange(file: FileList, fileOf) {
    let fileToUpload = file.item(0);

    let reader = new FileReader();
    reader.onload = (event: any) => {
      let imageUrl = event.target.result;

      if (fileOf === "logoPath") {
        this.generalSettingsForm.patchValue({
          logoPath: imageUrl,
          fileSource1: file[0],
        });
      } else if (fileOf === "faviconPath") {
        this.generalSettingsForm.patchValue({
          faviconPath: imageUrl,
          fileSource2: file[0],
        });
      }

      this.ref.detectChanges();
    };
    reader.readAsDataURL(fileToUpload);
  }

  editGeneralSettings() {
    const formData = new FormData();
    formData.append("name", this.generalSettingsForm.value.name);
    formData.append("language", this.generalSettingsForm.value.language);
    formData.append("phoneCode", this.generalSettingsForm.value.phoneCode);
    formData.append("currency", this.generalSettingsForm.value.currency);
    formData.append("baseurl", this.generalSettingsForm.value.baseurl);
    formData.append("shareTrip", this.generalSettingsForm.value.shareTrip);
    formData.append("mapId", this.generalSettingsForm.value.mapId);
    formData.append("websiteKey", this.generalSettingsForm.value.websiteKey);
    formData.append("serverKey", this.generalSettingsForm.value.serverKey);
    formData.append("androidKey", this.generalSettingsForm.value.androidKey);
    formData.append("iosKey", this.generalSettingsForm.value.iosKey);
    formData.append("logoPath", this.generalSettingsForm.value.fileSource1);
    formData.append("faviconPath", this.generalSettingsForm.value.fileSource2);
    formData.append("androidCustomer", this.generalSettingsForm.value.androidCustomer);
    formData.append("androidPartner", this.generalSettingsForm.value.androidPartner);
    formData.append("iosCustomer", this.generalSettingsForm.value.iosCustomer);
    formData.append("iosPartner", this.generalSettingsForm.value.iosPartner);
    this.apiservice
      .CommonPostApi(formData, "common/configuration/app")
      .subscribe({
        next: (res) => {
          const data = res.data;
          this.toasterService.success(res.type, data.message);
        },
        error: (error) => {
          this.toasterService.danger(error.error.message);
        },
      });
  }

  goBackBtn() {
    this.location.back();
  }
}
