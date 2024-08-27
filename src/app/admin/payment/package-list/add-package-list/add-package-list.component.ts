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
import { ServerDataSource } from "ng2-smart-table";
import { Package } from "../../../../@theme/interface/interface";

@Component({
  selector: "ngx-add-package-list",
  templateUrl: "./add-package-list.component.html",
  styleUrls: ["./add-package-list.component.scss"],
})
export class AddPackageListComponent implements OnInit, OnDestroy {
  @ViewChild("DeleteDialog") deleteDialog: TemplateRef<any>;
  items = [
    {
      icon: "trash-2",
      title: this.translate.instant("PACKAGELIST.DELETEPACKAGELIST"),
    },
  ];
  packageListDeleteDialogClose: import("@nebular/theme").NbDialogRef<any>;
  baseurl = environment.BASEURL;
  packageForm: FormGroup;
  serviceAvailableCities: any;
  source: ServerDataSource;
  dataServiceSubscition: any;
  packageTypeDropDownData: any[] = featuresSettings.payPackageTypes;

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
    this.initializePackageForm();
    this.patchPackageForm();
    this.subscribeToMenuItem();
  }

  ngOnDestroy(): void {
    this.dialogObservable.unsubscribe();
    this.dataServiceSubscition.unsubscribe();
    if (this.packageListDeleteDialogClose)
      this.packageListDeleteDialogClose.close();
  }

  initializePackageForm() {
    this.packageForm = new FormGroup({
      id: new FormControl(""),
      packageName: new FormControl("", Validators.required),
      description: new FormControl("", Validators.required),
      packageType: new FormControl(null, Validators.required),
      amountOfThePackage: new FormControl(0, Validators.required),
      creditOfThePackage: new FormControl(0, Validators.required),
      packageValidity: new FormControl(0, Validators.required),
      userLimit: new FormControl(0, Validators.required),
      serviceCity: new FormControl(null, Validators.required),
      image: new FormControl(""),
      fileSource: new FormControl(""),
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

  get packageName() {
    return this.packageForm.get("packageName");
  }
  get description() {
    return this.packageForm.get("description");
  }
  get packageType() {
    return this.packageForm.get("packageType");
  }
  get amountOfThePackage() {
    return this.packageForm.get("amountOfThePackage");
  }
  get creditOfThePackage() {
    return this.packageForm.get("creditOfThePackage");
  }
  get packageValidity() {
    return this.packageForm.get("packageValidity");
  }
  get userLimit() {
    return this.packageForm.get("userLimit");
  }
  get serviceCity() {
    return this.packageForm.get("serviceCity");
  }

  patchPackageForm(): void {
    this.dataServiceSubscition = this.dataService
      .getNewRowInfo()
      .subscribe((data) => {
        const rowData: Package = data;
        if (JSON.stringify(rowData) !== "{}") {
          this.packageForm.patchValue({
            id: rowData._id,
            packageName: rowData.name,
            description: rowData.description,
            packageType: rowData.type,
            amountOfThePackage: rowData.amount,
            creditOfThePackage: rowData.credits,
            packageValidity: rowData.validity,
            userLimit: rowData.limit,
            serviceCity: rowData.serviceArea[0],
            image: this.baseurl + rowData.image,
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
        .CommonGetApi("module/subscription/package/" + id)
        .subscribe((res) => {
          const data = res.data.package[0];
          this.dataService.setNewRowInfo(data);
        });
    }
  }

  subscribeToMenuItem() {
    this.dialogObservable = this.menuService
      .onItemClick()
      .subscribe((event) => {
        if (
          event.item.title ===
          this.translate.instant("PACKAGELIST.DELETEPACKAGELIST")
        ) {
          this.openDeleteDialog(this.deleteDialog);
        }
      });
  }

  goBackBtn() {
    this.location.back();
  }

  addOrEditPackage() {
    if (this.packageForm.invalid) {
      this.packageForm.markAllAsTouched();
    } else {
      const formData = new FormData();
      formData.append("_id", this.packageForm.value.id);
      formData.append("name", this.packageForm.value.packageName);
      formData.append("description", this.packageForm.value.description);
      formData.append("type", this.packageForm.value.packageType);
      formData.append("amount", this.packageForm.value.amountOfThePackage);
      formData.append("credits", this.packageForm.value.creditOfThePackage);
      formData.append("validity", this.packageForm.value.packageValidity);
      formData.append("limit", this.packageForm.value.userLimit);
      formData.append("serviceArea", this.packageForm.value.serviceCity);
      formData.append("file", this.packageForm.value.fileSource);

      if (this.packageForm.value.id) {
        this.apiservice
          .CommonPutApi(
            "module/subscription/package/" + this.packageForm.value.id,
            formData
          )
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
        this.apiservice
          .CommonPostApi(formData, "module/subscription/package")
          .subscribe({
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

  deletePackageList() {
    this.apiservice
      .CommonDeleteApi(this.packageForm.value.id, "module/subscription/package")
      .subscribe((res) => {
        const data = res.data;
        this.toasterService.success(res.type, data.message);
        this.goBackBtn();
      });
  }

  openDeleteDialog(dialog: TemplateRef<any>) {
    this.packageListDeleteDialogClose = this.dialogService.open(dialog, {
      autoFocus: false,
      closeOnBackdropClick:
        featuresSettings.Nb_dialogbox_close_while_click_outside,
    });
  }

  deletePopUpData = {
    title: this.translate.instant("PACKAGELIST.DELETEPACKAGELIST"),
    data:
      this.translate.instant("COMMON.AREYOUSURE") +
      " " +
      this.translate.instant("PACKAGELIST.PACKAGELIST"),
  };

  closeDeletePopup(event: string) {
    if (event === "close") {
      this.packageListDeleteDialogClose.close();
    } else {
      this.deletePackageList();
    }
  }

  onChange(file: FileList) {
    let fileToUpload = file.item(0);

    let reader = new FileReader();
    reader.onload = (event: any) => {
      let imageUrl = event.target.result;

      this.packageForm.patchValue({
        image: imageUrl,
        fileSource: file[0],
      });
    };
    reader.readAsDataURL(fileToUpload);
  }
}
