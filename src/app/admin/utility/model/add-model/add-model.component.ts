import {
  Component,
  OnInit,
  OnDestroy,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import {
  NbDialogService,
  NbMenuService,
  NbToastrService,
} from "@nebular/theme";
import { TranslateService } from "@ngx-translate/core";
import { ApiService } from "../../../api.service";
import { DataService } from "../../../data.service";
import { Location } from "@angular/common";
import { Model } from "../../../../@theme/interface/interface";
import { featuresSettings } from "../../../../../environments/environment";

@Component({
  selector: "ngx-add-model",
  templateUrl: "./add-model.component.html",
  styleUrls: ["./add-model.component.scss"],
})
export class AddModelComponent implements OnInit, OnDestroy {
  @ViewChild("DeleteDialog") deleteDialog: TemplateRef<any>;
  items = [
    { icon: "trash-2", title: this.translate.instant("MODEL.DELETE_MODEL") },
  ];
  modelDeleteDialogClose: import("@nebular/theme").NbDialogRef<any>;
  modelForm: FormGroup;
  allMakes: any[] = [];
  makeId: any;
  enableModel: boolean = false;
  dataCopy: any;
  dataServiceSubscition: any;

  constructor(
    private dataService: DataService,
    private router: Router,
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
    this.initializeModelForm();
    this.PatchModelForm();
    this.getAllMakesData();
    this.subscribeToMenuItem();
  }

  ngOnDestroy(): void {
    this.dialogObservable.unsubscribe();
    this.dataServiceSubscition.unsubscribe();
    if (this.modelDeleteDialogClose) this.modelDeleteDialogClose.close();
  }

  initializeModelForm() {
    this.modelForm = new FormGroup({
      id: new FormControl(""),
      modelname: new FormControl("", Validators.required),
      modelyear: new FormControl("", Validators.required),
      makename: new FormControl(null, Validators.required),
    });
  }

  PatchModelForm() {
    this.dataServiceSubscition = this.dataService
      .getNewRowInfo()
      .subscribe((data) => {
        this.makeId = data.make_id;
        const rowData: Model = data;
        if (JSON.stringify(rowData) !== "{}") {
          this.modelForm.patchValue({
            id: rowData._id,
            modelname: rowData.name,
            modelyear: rowData.year,
            makename: rowData.make_id,
          });
        } else {
          this.dataFetchWhileReload();
        }
      });
  }

  dataFetchWhileReload() {
    let id = this.ActivatedRoute.snapshot.paramMap.get("id");
    if (id) {
      this.apiservice.CommonGetApi("common/model/" + id).subscribe((res) => {
        const data = res.data.models[0];
        this.dataService.setNewRowInfo(data);
      });
    }
  }

  getAllMakesData() {
    this.apiservice.CommonGetApi("common/make").subscribe({
      next: (response) => {
        let makes: [] = response.data.makes;
        makes.map((item) => {
          this.allMakes.push(item);
        });
      },
      error: (error) => {
        this.toasterService.danger(error.error.message);
      },
    });
  }

  addOrEditModel() {
    if (this.modelForm.invalid) {
      this.modelForm.markAllAsTouched();
    } else {
      const payLoad = {
        name: this.modelForm.value.modelname,
        year: this.modelForm.value.modelyear,
        make_id: this.makeId,
      };
      if (this.modelForm.value.id) {
        this.apiservice
          .CommonPutApi("common/model/" + this.modelForm.value.id, payLoad)
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
        this.apiservice.CommonPostApi(payLoad, "common/model").subscribe({
          next: (res) => {
            const data = res.data;
            this.toasterService.success(res.type, data.message);
            this.router.navigate(["/admin/utility/view-model"]);

            this.goBackBtn();
          },
          error: (error) => {
            const data = error.error;
            this.toasterService.danger(data.message);
          },
        });
      }
    }
  }

  deleteModel() {
    this.apiservice
      .CommonDeleteApi(this.modelForm.value.id, "common/model")
      .subscribe((res) => {
        const data = res.data;
        this.toasterService.success(res.type, data.message);
        this.goBackBtn();
      });
  }

  get modelname() {
    return this.modelForm.get("modelname");
  }

  get modelyear() {
    return this.modelForm.get("modelyear");
  }
  get makename() {
    return this.modelForm.get("makename");
  }

  subscribeToMenuItem() {
    this.dialogObservable = this.menuService
      .onItemClick()
      .subscribe((event) => {
        if (event.item.title === this.translate.instant("MODEL.DELETE_MODEL")) {
          this.openDeleteDialog(this.deleteDialog);
        }
      });
  }

  goBackBtn() {
    this.location.back();
  }

  onSelectMake(eventData: any) {
    this.makeId = eventData;
    this.modelForm.patchValue({
      modelname: "",
      modelyear: "",
    });
  }

  openDeleteDialog(dialog: TemplateRef<any>) {
    this.modelDeleteDialogClose = this.dialogService.open(dialog, {
      autoFocus: false,
      closeOnBackdropClick:
        featuresSettings.Nb_dialogbox_close_while_click_outside,
    });
  }

  deletePopUpData = {
    title: this.translate.instant("MODEL.DELETE_MODEL"),
    data:
      this.translate.instant("COMMON.AREYOUSURE") +
      " " +
      this.translate.instant("MODEL.MODEL"),
  };

  closeDeletePopup(event: string) {
    if (event === "close") {
      this.modelDeleteDialogClose.close();
    } else {
      this.deleteModel();
    }
  }
}
