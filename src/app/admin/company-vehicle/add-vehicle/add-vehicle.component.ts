import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { DataService } from "../../data.service";
import {
  environment,
  CommonData,
  Year_selection,
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
import { Vehicle } from "../../../@theme/interface/interface";
import * as moment from "moment";

@Component({
  selector: "ngx-add-vehicle",
  templateUrl: "./add-vehicle.component.html",
  styleUrls: ["./add-vehicle.component.scss"],
})
export class AddVehicleComponent implements OnInit {
  @ViewChild("DeleteDialog") DeleteDialog: TemplateRef<any>;
  @ViewChild("DocumentUpdateDialog") DocumentUpdateDialog: TemplateRef<any>;
  @ViewChild("VehicleDocumentRejectDialog")
  vehicleDocumentRejectDialog: TemplateRef<any>;
  items = [
    { icon: "trash-2", title: this.translate.instant("COMMON.DELETEVEHICLE") },
  ];
  documentItems = [
    {
      icon: "edit-2-outline",
      title: this.translate.instant("COMMON.ACTION"),
    },
    {
      icon: "checkmark-circle-2-outline",
      title: this.translate.instant("COMMON.ACCEPT"),
    },
    {
      icon: "close-circle-outline",
      title: this.translate.instant("COMMON.DECLINED"),
    },
  ];
  needDocuments: any;
  fieldName: any;
  vehicleDeleteDialogClose: import("@nebular/theme").NbDialogRef<any>;
  vehicleDocumentDialogClose: import("@nebular/theme").NbDialogRef<any>;
  vehicleDocumentRejectDialogClose: import("@nebular/theme").NbDialogRef<any>;

  subscribeToMenuItem() {
    this.dialogObservable = this.menuService
      .onItemClick()
      .subscribe((event) => {
        if (
          event.item.title === this.translate.instant("COMMON.DELETEVEHICLE")
        ) {
          this.openDeleteDialog(this.DeleteDialog);
        }
        if (event.tag && event.item.title == this.translate.instant("COMMON.ACTION")) {
          let result = this.needDocuments.filter(
            (el) => el.indexName == event.tag
          );
          this.openDocumentUpdateDialog(this.DocumentUpdateDialog, result[0]);
        }
        if (event.tag && event.item.title == this.translate.instant("COMMON.ACCEPT")) {
          const objectData = {
            name: event.tag,
            docFor: "vehicleDocs",
            vehicleId: this.companyVehicleForm.value.id,
            status: "approved",
            reason: "",
          };
          this.apiservice
            .CommonPatchApi(objectData, "common/document/updateStatus")
            .subscribe({
              next: (res) => {
                const data = res.data;
                this.toasterService.success(res.type, res.message);
                this.documentApi();
              },
              error: (error) => {
                this.toasterService.danger(error.error.message);
              },
            });
        }
        if (event.tag && event.item.title == this.translate.instant("COMMON.DECLINED")) {
          this.vehicleDocumentRejectForm.patchValue({
            name: event.tag,
            docFor: "vehicleDocs",
            vehicleId: this.companyVehicleForm.value.id,
            status: "rejected",
          });
          this.openVehicleDocumentRejectDialog(
            this.vehicleDocumentRejectDialog
          );
        }
      });
  }
  baseurl = environment.BASEURL;
  companyVehicleForm: FormGroup;
  vehicleDocumentRejectForm: FormGroup;
  makes: any;
  models: any;
  servicetypes: any;
  ownertypes: any;
  companys: any;
  drivers: any;
  partners: any;
  years: any;
  dataServiceSubscition: any;
  collapsed = true;
  minDate = new Date();

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
    this.initializedriverForm();
    this.initializeVehicleDocumentRejectForm();
    this.patchdriverForm();
    // this.makeid();
    // this.ownertypeinitial();
    this.subscribeToMenuItem();
  }

  ngOnDestroy(): void {
    this.dialogObservable.unsubscribe();
    this.dataServiceSubscition.unsubscribe();
    if (this.vehicleDeleteDialogClose) this.vehicleDeleteDialogClose.close();
    if (this.vehicleDocumentDialogClose)
      this.vehicleDocumentDialogClose.close();
    if (this.vehicleDocumentRejectDialogClose)
      this.vehicleDocumentRejectDialogClose.close();
  }

  initializeVehicleDocumentRejectForm() {
    this.vehicleDocumentRejectForm = new FormGroup({
      reason: new FormControl("", [Validators.required]),
      name: new FormControl(""),
      docFor: new FormControl(""),
      vehicleId: new FormControl(""),
      status: new FormControl(""),
    });
  }

  get reason() {
    return this.vehicleDocumentRejectForm.get("reason");
  }

  initializedriverForm() {
    this.companyVehicleForm = new FormGroup({
      id: new FormControl(null),
      // name: new FormControl(""),
      regno: new FormControl("", [
        Validators.required,
        Validators.pattern(featuresSettings.NoPlatePattern),
      ]),
      make: new FormControl(null, Validators.required),
      model: new FormControl(null, Validators.required),
      servicetype: new FormControl(null, Validators.required),
      year: new FormControl(null, Validators.required),
      color: new FormControl("", Validators.required),
      ownertype: new FormControl(null, Validators.required),
      ownerId: new FormControl(null, Validators.required),
      partnerId: new FormControl(null, Validators.required),
    });
    this.apiservice.CommonGetApi("common/make").subscribe({
      next: (res) => {
        this.makes = res.data.makes;
      },
      error: (error) => {
        this.toasterService.danger(error.error.message);
      },
    });
    this.apiservice.CommonGetApi("common/partner").subscribe({
      next: (res) => {
        this.partners = res.data.partner;
      },
      error: (error) => {
        this.toasterService.danger(error.error.message);
      },
    });
    this.apiservice.CommonGetApi("creteria/serviceType/list").subscribe({
      next: (res) => {
        this.servicetypes = res.data.ServiceType;
      },
      error: (error) => {
        this.toasterService.danger(error.error.message);
      },
    });
    this.years = Year_selection.year();
    this.ownertypes = CommonData.ownertype;
  }

  get regno() {
    return this.companyVehicleForm.get("regno");
  }
  get make() {
    return this.companyVehicleForm.get("make");
  }
  get model() {
    return this.companyVehicleForm.get("model");
  }
  get servicetype() {
    return this.companyVehicleForm.get("servicetype");
  }
  get year() {
    return this.companyVehicleForm.get("year");
  }
  get color() {
    return this.companyVehicleForm.get("color");
  }
  get ownertype() {
    return this.companyVehicleForm.get("ownertype");
  }
  get ownerId() {
    return this.companyVehicleForm.get("ownerId");
  }
  get partnerId() {
    return this.companyVehicleForm.get("partnerId");
  }

  patchdriverForm(): void {
    this.dataServiceSubscition = this.dataService
      .getNewRowInfo()
      .subscribe((data) => {
        console.log(data, "data");
        const rowData: Vehicle = data;
        console.log(rowData, "4325")
        console.log(JSON.stringify(rowData),"=================")
        if (JSON.stringify(rowData) !== "{}") {
          this.companyVehicleForm.patchValue({
            id: rowData._id,
            regno: rowData.registrationnumber,
            make: rowData.makeid,
            model: rowData.model,
            servicetype: rowData.servicetype,
            year: rowData.year,
            color: rowData.color,
            ownertype: rowData.ownerType,
            ownerId: rowData.ownerId,
            partnerId: rowData.partnerId,
          });
          this.makeid();
          this.ownertypeinitial();
          this.apiservice
            .CommonGetApi(
              `common/document/vehicle/${this.companyVehicleForm.value.partnerId}/${this.companyVehicleForm.value.id}`
            )
            .subscribe((res) => {
              this.needDocuments = res.data.documents;
              this.checkExpiry();
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
        .CommonGetApi("creteria/vehicle/" + id)
        .subscribe((res) => {
          const data = res.data.Vehicle?res.data.Vehicle[0]:'';
          this.dataService.setNewRowInfo(data);
        });
      this.makeid();
      this.ownertypeinitial();
    }
  }

  makeid() {
    if (this.companyVehicleForm.value.make) {
      this.getModelInitial(this.companyVehicleForm.value.make);
    }
  }

  ownertypeinitial() {
    if (this.companyVehicleForm.value.ownertype) {
      this.getOwnerIdInitial(this.companyVehicleForm.value.ownertype);
    }
  }

  goBackBtn() {
    this.location.back();
  }

  addOrEditDriverTaxi() {
    if (this.companyVehicleForm.value.invalid) {

      this.companyVehicleForm.markAllAsTouched();
    } else {
      const payload = {
        _id: this.companyVehicleForm.value.id,
        registrationnumber: this.companyVehicleForm.value.regno,
        makeid: this.companyVehicleForm.value.make,
        model: this.companyVehicleForm.value.model,
        year: this.companyVehicleForm.value.year,
        color: this.companyVehicleForm.value.color,
        servicetype: this.companyVehicleForm.value.servicetype,
        ownerType: this.companyVehicleForm.value.ownertype,
        ownerId: this.companyVehicleForm.value.ownerId,
        partnerId: this.companyVehicleForm.value.partnerId,
  
      }

      //65250725938bc77fc492c959 list _id
      if (this.companyVehicleForm.value.id) {
        this.apiservice
          .CommonPutApi(
            "creteria/vehicle/" + this.companyVehicleForm.value.id,
            payload
          )
          .subscribe({
            next: (res) => {
              const data = res.data;
              this.toasterService.success(res.type, data.message);
            },
            error: (error) => {
              const data = error.error;
              this.toasterService.danger(data.message);
            },
          });
      } else {
        this.apiservice.CommonPostApi(payload, "creteria/vehicle").subscribe({
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

  deleteVehicle() {
    this.apiservice
      .CommonDeleteApi(this.companyVehicleForm.value.id, "creteria/vehicle")
      .subscribe((res) => {
        const data = res.data;
        this.toasterService.success(res.type, data.message);
        this.goBackBtn();
      });
  }

  getModelInitial(event) {
    if (event) {
      this.apiservice.CommonGetApi("common/list/models/" + event).subscribe({
        next: (res) => {
          this.models = res.data.models;
        },
        error: (error) => {
          this.toasterService.danger(error.error.message);
        },
      });
    }
  }

  getModel(event) {
    if (event) {
      this.apiservice.CommonGetApi("common/list/models/" + event).subscribe({
        next: (res) => {
          this.models = res.data.models;
        },
        error: (error) => {
          this.toasterService.danger(error.error.message);
        },
      });
    }
    this.companyVehicleForm.patchValue({
      model: null,
    });
  }

  getOwnerIdInitial(event) {
    if (event) {
      if (event == "COMPANY") {
        this.apiservice.CommonGetApi("common/company").subscribe({
          next: (res) => {
            this.companys = res.data.company;
          },
          error: (error) => {
            this.toasterService.danger(error.error.message);
          },
        });
      } else if (event == "PARTNER") {
        this.apiservice.CommonGetApi("common/Partner").subscribe({
          next: (res) => {
            this.drivers = res.data.partner;
          },
          error: (error) => {
            this.toasterService.danger(error.error.message);
          },
        });
      }
    }
  }

  getData() {
    if (this.companyVehicleForm.value.ownertype == "COMPANY") {
      this.apiservice.CommonGetApi("common/company").subscribe({
        next: (res) => {
          this.companys = res.data.company;
        },
        error: (error) => {
          this.toasterService.danger(error.error.message);
        },
      });
    } else if (this.companyVehicleForm.value.ownertype == "PARTNER") {
      this.apiservice.CommonGetApi("common/Partner").subscribe({
        next: (res) => {
          this.drivers = res.data.partner;
        },
        error: (error) => {
          this.toasterService.danger(error.error.message);
        },
      });
    }
    this.companyVehicleForm.patchValue({
      ownerId: null,
    });
  }

  openDeleteDialog(dialog: TemplateRef<any>) {
    this.vehicleDeleteDialogClose = this.dialogService.open(dialog, {
      autoFocus: false,
      closeOnBackdropClick:
        featuresSettings.Nb_dialogbox_close_while_click_outside,
    });
  }

  deletePopUpData = {
    title: this.translate.instant("COMMON.DELETEVEHICLE"),
    data:
      this.translate.instant("COMMON.AREYOUSURE") +
      " " +
      this.translate.instant("COMMON.VEHICLE"),
  };

  closeDeletePopup(event: string) {
    if (event === "close") {
      this.vehicleDeleteDialogClose.close();
    } else {
      this.deleteVehicle();
    }
  }

  vehicleDocumentRejectFunction() {
    if (this.vehicleDocumentRejectForm.invalid) {
      this.vehicleDocumentRejectForm.markAllAsTouched();
    } else {
      const payLoad = {
        name: this.vehicleDocumentRejectForm.value.name,
        docFor: this.vehicleDocumentRejectForm.value.docFor,
        vehicleId: this.vehicleDocumentRejectForm.value.vehicleId,
        status: this.vehicleDocumentRejectForm.value.status,
        reason: this.vehicleDocumentRejectForm.value.reason,
      };

      this.apiservice
        .CommonPatchApi(payLoad, "common/document/updateStatus")
        .subscribe({
          next: (res) => {
            const data = res.data;
            this.toasterService.success(res.type, res.message);
            this.documentApi();
            this.vehicleDocumentRejectDialogClose.close();
          },
          error: (error) => {
            this.toasterService.danger(error.error.message);
          },
        });
    }
  }

  openVehicleDocumentRejectDialog(dialog: TemplateRef<any>) {
    this.vehicleDocumentRejectDialogClose = this.dialogService.open(dialog, {
      context:
        this.translate.instant("COMMON.AREYOUSURE") +
        " " +
        this.translate.instant("DRIVER.DRIVER"),
      autoFocus: false,
      closeOnBackdropClick:
        featuresSettings.Nb_dialogbox_close_while_click_outside,
    });
    // this.initializeDriverDocumentRejectForm();
  }

  openDocumentUpdateDialog(dialog: TemplateRef<any>, dialogData) {
    this.vehicleDocumentDialogClose = this.dialogService.open(dialog, {
      context: dialogData,
      autoFocus: false,
      closeOnBackdropClick:
        featuresSettings.Nb_dialogbox_close_while_click_outside,
    });
    this.fieldName = dialogData.indexName;
  }

  accordionDropDown() {
    if (this.collapsed == true) {
      this.collapsed = false;
    } else if (this.collapsed == false) {
      this.collapsed = true;
    }
  }

  vehicleDocumentUpdate() {
    const formData = new FormData();
    for (const property in this.test) {
      formData.append(property, this.test[property]);
    }
    this.apiservice
      .CommonPostApi(
        formData,
        `common/document/vehicle/${this.companyVehicleForm.value.partnerId}/${this.companyVehicleForm.value.id}`
      )
      .subscribe({
        next: (res) => {
          console.log(res, "hgggggg")
          const data = res.data;
          this.toasterService.success(res.type, data.message);
          this.documentApi();
          this.vehicleDocumentDialogClose.close();
        },
        error: (error) => {
          this.toasterService.danger(error.error.message);
        },
      });
  }

  test = {};
  onChangeForVehicleDocumentUpload(event, name, type) {
    // if (this.companyVehicleForm.value.id) {
    //   this.test["_id"] = this.companyVehicleForm.value.id;
    // }
    if (this.fieldName) {
      this.test["fieldName"] = this.fieldName;
    }
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

  documentActions(status, documentUploadedStatus) {
    if (status == "pending" && documentUploadedStatus) {
      this.documentItems = [
        {
          icon: "edit-2-outline",
          title: this.translate.instant("COMMON.ACTION"),
        },
        {
          icon: "checkmark-circle-2-outline",
          title: this.translate.instant("COMMON.ACCEPT"),
        },
        {
          icon: "close-circle-outline",
          title: this.translate.instant("COMMON.DECLINED"),
        },
      ];
    } else if (status == "pending" && !documentUploadedStatus) {
      this.documentItems = [
        {
          icon: "edit-2-outline",
          title: this.translate.instant("COMMON.ACTION"),
        },
      ];
    } else if (status == "approved") {
      this.documentItems = [
        {
          icon: "edit-2-outline",
          title: this.translate.instant("COMMON.ACTION"),
        },
        {
          icon: "close-circle-outline",
          title: this.translate.instant("COMMON.DECLINED"),
        },
      ];
    } else if (status == "rejected") {
      this.documentItems = [
        {
          icon: "edit-2-outline",
          title: this.translate.instant("COMMON.ACTION"),
        },
        {
          icon: "checkmark-circle-2-outline",
          title: this.translate.instant("COMMON.ACCEPT"),
        },
      ];
    }
  }

  documentApi() {
    this.apiservice
      .CommonGetApi(
        `common/document/vehicle/${this.companyVehicleForm.value.partnerId}/${this.companyVehicleForm.value.id}`
      )
      .subscribe((res) => {
        this.needDocuments = res.data.documents;
        this.checkExpiry();
      });
  }
  isExpired(expiryDate: string | Date): boolean {
    const today = new Date();
    const expiry = new Date(expiryDate);
    return expiry <= today;
  }
  checkExpiry() {
    this.needDocuments.forEach(doc => {
      doc.expired = false; // Initialize expired flag
      
      doc.fields.forEach(data => {
        if (data.type === 'date') {
          const isExpired = this.isExpired(data.value);
          if (isExpired) {
            doc.expired = true; // Set expired flag for the document
          }
        }
      });
    });
  }
}
