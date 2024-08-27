import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
  NbTagComponent,
  NbTagInputAddEvent,
} from "@nebular/theme";
import { Location } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";
import { list_Services } from "../../../../@theme/interface/interface";
@Component({
  selector: "ngx-add-list-services",
  templateUrl: "./add-list-services.component.html",
  styleUrls: ["./add-list-services.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddListServicesComponent implements OnInit, OnDestroy {
  @ViewChild("DeleteDialog") deleteDialog: TemplateRef<any>;
  items = [
    { icon: "trash-2", title: this.translate.instant("DRIVER.DELETEDRIVER") },
  ];
  servicesDeleteDialogClose: import("@nebular/theme").NbDialogRef<any>;
  baseurl = environment.BASEURL;
  listServiceForm: FormGroup;
  LowerServiceType: any;
  true_or_false = CommonData.true_or_false;
  available_or_unavailable = CommonData.available_or_unavailable;
  genders = CommonData.genders;
  trees: Set<string> = new Set([]);
  rawData: list_Services;
  // rawData = CommonData.LowerServiceTypes;
  dropdownSettings = {
    singleSelection: false,
    idField: "scId",
    textField: "name",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    itemsShowLimit: 3,
    allowSearchFilter: true,
  };

  dataServiceSubscition: any;
  currencys: any;
  lowerServices: any;
  servicetypes: any;
  LowerServiceTypes: any;
  constructor(
    private DataService: DataService,
    private dataService: DataService,
    private apiservice: ApiService,
    private toasterService: NbToastrService,
    private location: Location,
    public translate: TranslateService,
    private dialogService: NbDialogService,
    private menuService: NbMenuService,
    private ref: ChangeDetectorRef,
    private ActivatedRoute: ActivatedRoute,

  ) { }
  dialogObservable: any;

  ngOnInit(): void {
    this.initializedriverForm();
    this.patchdriverForm();
    this.subscribeToMenuItem();
    let id = this.ActivatedRoute.snapshot.paramMap.get("id");
  }

  ngOnDestroy(): void {
    this.dialogObservable.unsubscribe();
    this.dataServiceSubscition.unsubscribe();
    if (this.servicesDeleteDialogClose) this.servicesDeleteDialogClose.close();
  }

  async initializedriverForm() {
    this.listServiceForm = new FormGroup({
      id: new FormControl(""),
      name: new FormControl("", Validators.required),
      order: new FormControl("", Validators.required),
      lowerServicesType: new FormControl(null, Validators.required),
      rideLater: new FormControl(null, Validators.required),
      description: new FormControl(""),
      status: new FormControl(null, Validators.required),
      seats: new FormControl("", Validators.required),
      image1: new FormControl("", Validators.required),
      image2: new FormControl(""),
      fileSource1: new FormControl(""),
      fileSource2: new FormControl(""),
      gender: new FormControl(""),
      features: new FormControl(""),
    });
    this.apiservice.CommonGetApi("creteria/serviceType/list").subscribe({
      next: (res) => {
        console.log("servicetypelist")
        this.LowerServiceTypes = res.data.ServiceType;
        this.listServiceForm.patchValue({
          lowerServicesType: this.rawData.lowerServicesType
        });
      },
      error: (error) => {
        this.toasterService.danger(error.error.message);
      },
    });
  }

  get name() {
    return this.listServiceForm.get("name");
  }
  get order() {
    return this.listServiceForm.get("order");
  }
  get lowerServicesType() {
    return this.listServiceForm.get("lowerServicesType");
  }
  get rideLater() {
    return this.listServiceForm.get("rideLater");
  }
  get description() {
    return this.listServiceForm.get("description");
  }
  get status() {
    return this.listServiceForm.get("status");
  }
  get seats() {
    return this.listServiceForm.get("seats");
  }
  get image1() {
    return this.listServiceForm.get("image1");
  }
  get gender() {
    return this.listServiceForm.get("gender");
  }
  get features() {
    return this.listServiceForm.get("features");
  }

  patchdriverForm(): void {
    this.dataServiceSubscition = this.dataService
      .getNewRowInfo()
      .subscribe((data: any) => {
        const rowData: list_Services = data;
        if (JSON.stringify(rowData) !== "{}") {
          this.rawData = rowData
          this.listServiceForm.patchValue({
            id: rowData._id,
            name: rowData.name,
            order: rowData.order,
            rideLater: rowData.scheduleLater,
            description: rowData.description,
            status: rowData.status,
            seats: rowData.seats,
            image1: this.baseurl + rowData.image,
            image2: this.baseurl + rowData.topViewImage,
            gender: rowData.gender,
            features: rowData.features,
          });
          this.trees = new Set(rowData.features);


        } else {
          this.dataFetchWhileReload();
        }
      });
  }

  dataFetchWhileReload() {
    let id = this.ActivatedRoute.snapshot.paramMap.get("id");
    if (id) {
      this.apiservice
        .CommonGetApi("creteria/serviceType/" + id)
        .subscribe((res) => {
          const data = res.data.admin[0];
          this.dataService.setNewRowInfo(data);
        });
    }
  }

  subscribeToMenuItem() {
    this.dialogObservable = this.menuService
      .onItemClick()
      .subscribe((event) => {
        if (
          event.item.title === this.translate.instant("DRIVER.DELETEDRIVER")
        ) {
          this.openDeleteDialog(this.deleteDialog);
        }
      });
  }

  goBackBtn() {
    this.location.back();
  }

  onChange(file: FileList, fileOf) {
    let fileToUpload = file.item(0);

    let reader = new FileReader();
    reader.onload = (event: any) => {
      let imageUrl = event.target.result;

      if (fileOf === "file1") {
        this.listServiceForm.patchValue({
          image1: imageUrl,
          fileSource1: file[0],
        });
      } else if (fileOf === "file2") {
        this.listServiceForm.patchValue({
          image2: imageUrl,
          fileSource2: file[0],
        });
      }

      this.ref.detectChanges();
    };
    reader.readAsDataURL(fileToUpload);
  }

  addOrEditService() {
    if (this.listServiceForm.invalid) {
      this.listServiceForm.markAllAsTouched();
    } else {
      const formData = new FormData();
      formData.append("name", this.listServiceForm.value.name);
      formData.append("order", this.listServiceForm.value.order);
      formData.append("lowerServicesType", this.listServiceForm.value.lowerServicesType);
      formData.append("rideLater", this.listServiceForm.value.rideLater);
      formData.append("description", this.listServiceForm.value.description);
      formData.append("status", this.listServiceForm.value.status);
      formData.append("seats", this.listServiceForm.value.seats);
      formData.append("file1", this.listServiceForm.value.fileSource1);
      formData.append("file2", this.listServiceForm.value.fileSource2);
      formData.append("gender", this.listServiceForm.value.gender);
      formData.append("features", [...this.trees].toLocaleString());

      if (this.listServiceForm.value.id) {
        this.apiservice
          .CommonPutApi(
            "creteria/serviceType/" + this.listServiceForm.value.id,
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
        this.apiservice
          .CommonPostApi(formData, "creteria/serviceType")
          .subscribe({
            next: (res) => {

              this.toasterService.success(res.type, res.message);
              this.goBackBtn();
            },
            error: (error) => {
              this.toasterService.danger(error.error.message);
            },
          });
      }
    }
  }

  deleteService() {
    this.apiservice
      .CommonDeleteApi(this.listServiceForm.value.id, "creteria/serviceType")
      .subscribe((res) => {
        const data = res.data;
        this.toasterService.success(data.message);
        this.goBackBtn();
      });
  }

  openDeleteDialog(dialog: TemplateRef<any>) {
    this.servicesDeleteDialogClose = this.dialogService.open(dialog, {
      autoFocus: false,
      closeOnBackdropClick:
        featuresSettings.Nb_dialogbox_close_while_click_outside,
    });
  }

  deletePopUpData = {
    title: this.translate.instant("SERVICES.DELETESERVICE"),
    data:
      this.translate.instant("COMMON.AREYOUSURE") +
      " " +
      this.translate.instant("SERVICES.SERVICE"),
  };

  closeDeletePopup(event: string) {
    if (event === "close") {
      this.servicesDeleteDialogClose.close();
    } else {
      this.deleteService();
    }
  }

  onTagRemove(tagToRemove: NbTagComponent): void {
    this.trees.delete(tagToRemove.text);
  }

  onTagAdd({ value, input }: NbTagInputAddEvent): void {
    if (value) {
      this.trees.add(value);
    }
    input.nativeElement.value = "";
  }
  CommonGetApi(path: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.apiservice.CommonGetApi(path).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
}
