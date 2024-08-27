import {
  Component,
  OnInit,
  OnDestroy,
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
import { Onboard } from "../../../../@theme/interface/interface";

@Component({
  selector: "ngx-add-onboard",
  templateUrl: "./add-onboard.component.html",
  styleUrls: ["./add-onboard.component.scss"],
})
export class AddOnboardComponent implements OnInit, OnDestroy {
  @ViewChild("DeleteDialog") deleteDialog: TemplateRef<any>;
  items = [
    { icon: "trash-2", title: this.translate.instant("ONBOARD.DELETEONBOARD") },
  ];
  onboardDeleteDialogClose: import("@nebular/theme").NbDialogRef<any>;

  baseurl = environment.BASEURL;
  onboardForm: FormGroup;
  dataServiceSubscition: any;

  constructor(
    private dataService: DataService,
    private apiservice: ApiService,
    private toasterService: NbToastrService,
    private location: Location,
    public translate: TranslateService,
    private dialogService: NbDialogService,
    private menuService: NbMenuService,
    private ActivatedRoute: ActivatedRoute
  ) {}
  dialogObservable: any;
  ngOnInit(): void {
    this.initializeOnboardForm();
    this.patchOnboardForm();
    this.subscribeToMenuItem();
  }

  ngOnDestroy(): void {
    this.dialogObservable.unsubscribe();
    this.dataServiceSubscition.unsubscribe();
    if (this.onboardDeleteDialogClose) this.onboardDeleteDialogClose.close();
  }

  initializeOnboardForm() {
    this.onboardForm = new FormGroup({
      id: new FormControl(""),
      title: new FormControl("", Validators.required),
      description: new FormControl("", Validators.required),
      image: new FormControl("", Validators.required),
      fileSource: new FormControl(""),
    });
  }
  get title() {
    return this.onboardForm.get("title");
  }
  get description() {
    return this.onboardForm.get("description");
  }
  get image() {
    return this.onboardForm.get("image");
  }

  patchOnboardForm(): void {
    this.dataServiceSubscition = this.dataService
      .getNewRowInfo()
      .subscribe((data) => {
        const rowData: Onboard = data;
        if (JSON.stringify(rowData) !== "{}") {
          this.onboardForm.patchValue({
            id: rowData._id,
            title: rowData.title,
            description: rowData.description,
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
        .CommonGetApi("admin/onboardings/" + id)
        .subscribe((res) => {
          const data = res.data.onboarding[0];
          this.dataService.setNewRowInfo(data);
        });
    }
  }

  subscribeToMenuItem() {
    this.dialogObservable = this.menuService
      .onItemClick()
      .subscribe((event) => {
        if (
          event.item.title === this.translate.instant("ONBOARD.DELETEONBOARD")
        ) {
          this.openDeleteDialog(this.deleteDialog);
        }
      });
  }

  goBackBtn() {
    this.location.back();
  }

  onChange(file: FileList) {
    let fileToUpload = file.item(0);

    let reader = new FileReader();
    reader.onload = (event: any) => {
      let imageUrl = event.target.result;

      this.onboardForm.patchValue({
        image: imageUrl,
        fileSource: file[0],
      });
    };
    reader.readAsDataURL(fileToUpload);
  }

  addOrEditOnboarding() {
    if (this.onboardForm.invalid) {
      this.onboardForm.markAllAsTouched();
    } else {
      const formData = new FormData();
      formData.append("title", this.onboardForm.value.title);
      formData.append("description", this.onboardForm.value.description);
      formData.append("file", this.onboardForm.value.fileSource);

      if (this.onboardForm.value.id) {
        this.apiservice
          .CommonPutApi(
            "admin/onboardings/" + this.onboardForm.value.id,
            formData
          )
          .subscribe({
            next: (res) => {
              const data = res.data;
              // this.onboardForm.patchValue({
              //   image: this.baseurl + data.onboarding.image,
              // });
              this.toasterService.success(res.type, data.message);
            },
            error: (error) => {
              this.toasterService.danger(error.error.message);
            },
          });
      } else {
        this.apiservice.CommonPostApi(formData, "admin/onboardings").subscribe({
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

  deleteOnboarding() {
    this.apiservice
      .CommonDeleteApi(this.onboardForm.value.id, "admin/onboardings")
      .subscribe((res) => {
        const data = res.data;
        this.toasterService.success(res.type, data.message);
        this.goBackBtn();
      });
  }

  openDeleteDialog(dialog: TemplateRef<any>) {
    this.onboardDeleteDialogClose = this.dialogService.open(dialog, {
      autoFocus: false,
      closeOnBackdropClick:
        featuresSettings.Nb_dialogbox_close_while_click_outside,
    });
  }

  deletePopUpData = {
    title: this.translate.instant("ONBOARD.DELETEONBOARD"),
    data:
      this.translate.instant("COMMON.AREYOUSURE") +
      " " +
      this.translate.instant("ONBOARD.ONBOARD"),
  };

  closeDeletePopup(event: string) {
    if (event === "close") {
      this.onboardDeleteDialogClose.close();
    } else {
      this.deleteOnboarding();
    }
  }
}
