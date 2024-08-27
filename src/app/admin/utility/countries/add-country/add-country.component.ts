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
import { Country } from "../../../../@theme/interface/interface";

@Component({
  selector: "ngx-add-country",
  templateUrl: "./add-country.component.html",
  styleUrls: ["./add-country.component.scss"],
})
export class AddCountryComponent implements OnInit, OnDestroy {
  @ViewChild("DeleteDialog") deleteDialog: TemplateRef<any>;
  items = [
    { icon: "trash-2", title: this.translate.instant("COUNTRY.DELETECOUNTRY") },
  ];
  countryDeleteDialogClose: import("@nebular/theme").NbDialogRef<any>;
  baseurl = environment.BASEURL;
  countryForm: FormGroup;
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
    this.initializecountryForm();
    this.patchcountryForm();
    this.subscribeToMenuItem();
  }

  ngOnDestroy(): void {
    this.dialogObservable.unsubscribe();
    this.dataServiceSubscition.unsubscribe();
    if (this.countryDeleteDialogClose) this.countryDeleteDialogClose.close();
  }

  initializecountryForm() {
    this.countryForm = new FormGroup({
      id: new FormControl(""),
      countryname: new FormControl("", Validators.required),
      countrycode: new FormControl("", Validators.required),
      phonecode: new FormControl("", Validators.required),
    });
  }
  get countryname() {
    return this.countryForm.get("countryname");
  }
  get countrycode() {
    return this.countryForm.get("countrycode");
  }
  get phonecode() {
    return this.countryForm.get("phonecode");
  }

  patchcountryForm(): void {
    this.dataServiceSubscition = this.dataService
      .getNewRowInfo()
      .subscribe((data) => {
        const rowData: Country = data;
        if (JSON.stringify(rowData) !== "{}") {
          this.countryForm.patchValue({
            id: rowData._id,
            countryname: rowData.name,
            countrycode: rowData.code,
            phonecode: rowData.phonecode,
          });
        } else {
          this.dataFetchWhileReload();
        }
      });
  }

  dataFetchWhileReload() {
    let id = this.ActivatedRoute.snapshot.paramMap.get("id");
    if (id) {
      this.apiservice.CommonGetApi("common/country/" + id).subscribe((res) => {
        const data = res.data.countries[0];
        this.dataService.setNewRowInfo(data);
      });
    }
  }

  subscribeToMenuItem() {
    this.dialogObservable = this.menuService
      .onItemClick()
      .subscribe((event) => {
        if (
          event.item.title === this.translate.instant("COUNTRY.DELETECOUNTRY")
        ) {
          this.openDeleteDialog(this.deleteDialog);
        }
      });
  }

  goBackBtn() {
    this.location.back();
  }

  addOrEditCountry() {
    if (this.countryForm.invalid) {
      this.countryForm.markAllAsTouched();
    } else {
      // const formData = new FormData();
      // formData.append("name", this.countryForm.value.countryname);
      // formData.append("code", this.countryForm.value.countrycode);
      // formData.append("phonecode", this.countryForm.value.phonecode);
      const payLoad = {
        name: this.countryForm.value.countryname,
        code: this.countryForm.value.countrycode,
        phonecode: this.countryForm.value.phonecode,
      };

      if (this.countryForm.value.id) {
        this.apiservice
          .CommonPutApi("common/country/" + this.countryForm.value.id, payLoad)
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
        this.apiservice.CommonPostApi(payLoad, "common/country").subscribe({
          next: (res) => {
            const data = res.data;
            this.toasterService.success(res.type, data.message);
            this.router.navigate(["/admin/utility/view-country"]);

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

  deleteCountry() {
    this.apiservice
      .CommonDeleteApi(this.countryForm.value.id, "common/country")
      .subscribe((res) => {
        const data = res.data;
        this.toasterService.success(res.type, data.message);
        this.goBackBtn();
      });
  }

  openDeleteDialog(dialog: TemplateRef<any>) {
    this.countryDeleteDialogClose = this.dialogService.open(dialog, {
      autoFocus: false,
      closeOnBackdropClick:
        featuresSettings.Nb_dialogbox_close_while_click_outside,
    });
  }

  deletePopUpData = {
    title: this.translate.instant("COUNTRY.DELETECOUNTRY"),
    data:
      this.translate.instant("COMMON.AREYOUSURE") +
      " " +
      this.translate.instant("COUNTRY.COUNTRY"),
  };

  closeDeletePopup(event: string) {
    if (event === "close") {
      this.countryDeleteDialogClose.close();
    } else {
      this.deleteCountry();
    }
  }
}
