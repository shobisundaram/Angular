import {
  Component,
  OnInit,
  OnDestroy,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import {
  NbDialogService,
  NbMenuService,
  NbToastrService,
} from "@nebular/theme";
import { TranslateService } from "@ngx-translate/core";
import { ApiService } from "../../../api.service";
import { DataService } from "../../../data.service";
import { Make } from "../../../../@theme/interface/interface";
import { featuresSettings } from "../../../../../environments/environment";

@Component({
  selector: "ngx-add-make",
  templateUrl: "./add-make.component.html",
  styleUrls: ["./add-make.component.scss"],
})
export class AddMakeComponent implements OnInit, OnDestroy {
  @ViewChild("DeleteDialog") deleteDialog: TemplateRef<any>;
  items = [
    { icon: "trash-2", title: this.translate.instant("MAKE.DELETE_MAKE") },
  ];
  makeDeleteDialogClose: import("@nebular/theme").NbDialogRef<any>;
  makeForm: FormGroup;
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
    this.initializeMakeForm();
    this.patchMakeForm();
    this.subscribeToMenuItem();
  }

  ngOnDestroy(): void {
    this.dialogObservable.unsubscribe();
    this.dataServiceSubscition.unsubscribe();
    if (this.makeDeleteDialogClose) this.makeDeleteDialogClose.close();
  }

  initializeMakeForm() {
    this.makeForm = new FormGroup({
      id: new FormControl(""),
      makename: new FormControl("", Validators.required),
    });
  }
  patchMakeForm() {
    this.dataServiceSubscition = this.dataService
      .getNewRowInfo()
      .subscribe((data) => {
        const rowData: Make = data;
        if (JSON.stringify(rowData) !== "{}") {
          this.makeForm.patchValue({
            id: rowData._id,
            makename: rowData.name,
          });
        } else {
          this.dataFetchWhileReload();
        }
      });
  }

  dataFetchWhileReload() {
    let id = this.ActivatedRoute.snapshot.paramMap.get("id");
    if (id) {
      this.apiservice.CommonGetApi("common/make/" + id).subscribe((res) => {
        const data = res.data.makes[0];
        this.dataService.setNewRowInfo(data);
      });
    }
  }

  getAllMakeData() {
    this.apiservice.CommonGetApi("common/make").subscribe({
      next: (response) => {
        // let countries: [] = response.data.countries;
        // countries.map((item) => {
        //   this.allCountries.push(item);
        // });
      },
      error: (error) => {
        this.toasterService.danger(error.error.message);
      },
    });
  }

  addOrEditMake() {
    if (this.makeForm.invalid) {
      this.makeForm.markAllAsTouched();
    } else {
      const payLoad = {
        name: this.makeForm.value.makename,
      };

      if (this.makeForm.value.id) {
        this.apiservice
          .CommonPutApi("common/make/" + this.makeForm.value.id, payLoad)
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
        this.apiservice.CommonPostApi(payLoad, "common/make").subscribe({
          next: (res) => {
            const data = res.data;
            this.toasterService.success(res.type, data.message);
            this.router.navigate(["/admin/utility/view-make"]);

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

  deleteMake() {
    this.apiservice
      .CommonDeleteApi(this.makeForm.value.id, "common/make")
      .subscribe((res) => {
        const data = res.data;
        this.toasterService.success(res.type, data.message);
        this.goBackBtn();
      });
  }

  get makename() {
    return this.makeForm.get("makename");
  }

  subscribeToMenuItem() {
    this.dialogObservable = this.menuService
      .onItemClick()
      .subscribe((event) => {
        if (event.item.title === this.translate.instant("MAKE.DELETE_MAKE")) {
          this.openDeleteDialog(this.deleteDialog);
        }
      });
  }

  goBackBtn() {
    this.location.back();
  }

  openDeleteDialog(dialog: TemplateRef<any>) {
    this.makeDeleteDialogClose = this.dialogService.open(dialog, {
      autoFocus: false,
      closeOnBackdropClick:
        featuresSettings.Nb_dialogbox_close_while_click_outside,
    });
  }

  deletePopUpData = {
    title: this.translate.instant("MAKE.DELETE_MAKE"),
    data:
      this.translate.instant("COMMON.AREYOUSURE") +
      " " +
      this.translate.instant("MAKE.MAKE"),
  };

  closeDeletePopup(event: string) {
    if (event === "close") {
      this.makeDeleteDialogClose.close();
    } else {
      this.deleteMake();
    }
  }
}
