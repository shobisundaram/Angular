import {
  Component,
  OnInit,
  OnDestroy,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { DataService } from "../../../data.service";
import { featuresSettings } from "../../../../../environments/environment";
import { ApiService } from "../../../api.service";
import {
  NbDialogService,
  NbMenuService,
  NbToastrService,
} from "@nebular/theme";
import { Location } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";
import { State } from "../../../../@theme/interface/interface";

@Component({
  selector: "ngx-add-state",
  templateUrl: "./add-state.component.html",
  styleUrls: ["./add-state.component.scss"],
})
export class AddStateComponent implements OnInit, OnDestroy {
  @ViewChild("DeleteDialog") deleteDialog: TemplateRef<any>;
  items = [
    { icon: "trash-2", title: this.translate.instant("STATE.DELETESTATE") },
  ];
  stateDeleteDialogClose: import("@nebular/theme").NbDialogRef<any>;
  stateForm: FormGroup;
  allCountries: any[] = [];
  countryId: any;
  enableState: boolean = false;
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
    this.initializestateForm();
    this.patchstateForm();
    this.getAllCountries();
    this.subscribeToMenuItem();
  }

  ngOnDestroy(): void {
    this.dialogObservable.unsubscribe();
    this.dataServiceSubscition.unsubscribe();
    if (this.stateDeleteDialogClose) this.stateDeleteDialogClose.close();
  }

  initializestateForm() {
    this.stateForm = new FormGroup({
      id: new FormControl(""),
      statename: new FormControl("", Validators.required),
      statecode: new FormControl("", Validators.required),
      countryname: new FormControl(null, Validators.required),
    });
  }
  get statename() {
    return this.stateForm.get("statename");
  }

  get statecode() {
    return this.stateForm.get("statecode");
  }

  get countryname() {
    return this.stateForm.get("countryname");
  }

  patchstateForm(): void {
    this.dataServiceSubscition = this.dataService
      .getNewRowInfo()
      .subscribe((data) => {
        this.dataCopy = data;
        const rowData: State = data;
        if (JSON.stringify(rowData) !== "{}") {
          this.stateForm.patchValue({
            id: rowData._id,
            statename: rowData.name,
            statecode: rowData.code,
            countryname: rowData.country_id,
          });
        } else {
          this.dataFetchWhileReload();
        }
      });
  }

  dataFetchWhileReload() {
    let id = this.ActivatedRoute.snapshot.paramMap.get("id");
    if (id) {
      this.apiservice.CommonGetApi("common/state/" + id).subscribe((res) => {
        const data = res.data.states[0];
        this.dataService.setNewRowInfo(data);
      });
    }
  }

  subscribeToMenuItem() {
    this.dialogObservable = this.menuService
      .onItemClick()
      .subscribe((event) => {
        if (event.item.title === this.translate.instant("STATE.DELETESTATE")) {
          this.openDeleteDialog(this.deleteDialog);
        }
      });
  }

  goBackBtn() {
    this.location.back();
  }

  addOrEditstate() {
    let stateFormData = { ...this.stateForm.value, country_id: this.countryId };
    if (this.stateForm.invalid) {
      this.stateForm.markAllAsTouched();
    } else {
      const payLoad = {
        name: this.stateForm.value.statename,
        code: this.stateForm.value.statecode,
        country_id: this.countryId,
      };

      if (this.stateForm.value.id) {
        this.apiservice
          .CommonPutApi("common/state/" + this.stateForm.value.id, payLoad)
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
        this.apiservice.CommonPostApi(payLoad, "common/state").subscribe({
          next: (res) => {
            const data = res.data;
            this.toasterService.success(res.type, data.message);
            this.router.navigate(["/admin/utility/view-state"]);
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

  deletestate() {
    this.apiservice
      .CommonDeleteApi(this.stateForm.value.id, "common/state")
      .subscribe((res) => {
        const data = res.data;
        this.toasterService.success(res.type, data.message);
        this.goBackBtn();
      });
  }

  getAllCountries() {
    this.apiservice.CommonGetApi("common/list/country").subscribe({
      next: (response) => {
        let countries: [] = response.data.countries;
        countries.map((item) => {
          this.allCountries.push(item);
        });
      },
      error: (error) => {
        this.toasterService.danger(error.error.message);
      },
    });
  }

  onSelectCountry(eventData: any) {
    this.countryId = eventData;
    this.stateForm.patchValue({
      statename: "",
      statecode: "",
    });
  }

  openDeleteDialog(dialog: TemplateRef<any>) {
    this.stateDeleteDialogClose = this.dialogService.open(dialog, {
      autoFocus: false,
      closeOnBackdropClick:
        featuresSettings.Nb_dialogbox_close_while_click_outside,
    });
  }

  deletePopUpData = {
    title: this.translate.instant("STATE.DELETESTATE"),
    data:
      this.translate.instant("COMMON.AREYOUSURE") +
      " " +
      this.translate.instant("STATE.STATE"),
  };

  closeDeletePopup(event: string) {
    if (event === "close") {
      this.stateDeleteDialogClose.close();
    } else {
      this.deletestate();
    }
  }
}
