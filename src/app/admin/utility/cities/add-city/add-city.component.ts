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
import { City } from "../../../../@theme/interface/interface";

@Component({
  selector: "ngx-add-city",
  templateUrl: "./add-city.component.html",
  styleUrls: ["./add-city.component.scss"],
})
export class AddCityComponent implements OnInit, OnDestroy {
  @ViewChild("DeleteDialog") deleteDialog: TemplateRef<any>;
  items = [
    { icon: "trash-2", title: this.translate.instant("CITY.DELETECITY") },
  ];
  cityDeleteDialogClose: import("@nebular/theme").NbDialogRef<any>;
  baseurl = environment.BASEURL;
  cityForm: FormGroup;
  countrys: any;
  states: any;
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
    this.initializecityForm();
    this.patchcityForm();
    this.subscribeToMenuItem();
  }

  ngOnDestroy(): void {
    this.dialogObservable.unsubscribe();
    this.dataServiceSubscition.unsubscribe();
    if (this.cityDeleteDialogClose) this.cityDeleteDialogClose.close();
  }

  initializecityForm() {
    this.cityForm = new FormGroup({
      id: new FormControl(""),
      country_id: new FormControl(null, Validators.required),
      state_id: new FormControl(null, Validators.required),
      cityname: new FormControl("", Validators.required),
      citycode: new FormControl("", Validators.required),
      latitude: new FormControl("", Validators.required),
      longitude: new FormControl("", Validators.required),
    });
    this.apiservice.CommonGetApi("common/list/country").subscribe({
      next: (res) => {
        this.countrys = res.data.countries;
      },
      error: (error) => {
        this.toasterService.danger(error.error.message);
      },
    });
  }
  get country_id() {
    return this.cityForm.get("country_id");
  }
  get state_id() {
    return this.cityForm.get("state_id");
  }
  get cityname() {
    return this.cityForm.get("cityname");
  }
  get citycode() {
    return this.cityForm.get("citycode");
  }
  get latitude() {
    return this.cityForm.get("latitude");
  }
  get longitude() {
    return this.cityForm.get("longitude");
  }

  patchcityForm(): void {
    this.dataServiceSubscition = this.dataService
      .getNewRowInfo()
      .subscribe((data) => {
        const rowData: City = data;
        if (JSON.stringify(rowData) !== "{}") {
          this.cityForm.patchValue({
            id: rowData._id,
            country_id: rowData.country_id,
            state_id: rowData.state_id,
            cityname: rowData.name,
            citycode: rowData.code,
            latitude: rowData.latitude,
            longitude: rowData.longitude
          });
          this.countryid();
        } else {
          this.dataFetchWhileReload();
        }
      });
  }

  dataFetchWhileReload() {
    let id = this.ActivatedRoute.snapshot.paramMap.get("id");
    if (id) {
      this.apiservice.CommonGetApi("common/city/" + id).subscribe((res) => {
        const data = res.data.cities[0];
        this.dataService.setNewRowInfo(data);
      });
      this.countryid();
    }
  }

  countryid() {
    if (this.cityForm.value.country_id) {
      this.getStateInitial(this.cityForm.value.country_id);
    }
  }

  subscribeToMenuItem() {
    this.dialogObservable = this.menuService
      .onItemClick()
      .subscribe((event) => {
        if (event.item.title === this.translate.instant("CITY.DELETECITY")) {
          this.openDeleteDialog(this.deleteDialog);
        }
      });
  }

  goBackBtn() {
    this.location.back();
  }

  addOrEditCity() {
    if (this.cityForm.invalid) {
      this.cityForm.markAllAsTouched();
    } else {
      const payLoad = {
        country_id: this.cityForm.value.country_id,
        state_id: this.cityForm.value.state_id,
        name: this.cityForm.value.cityname,
        code: this.cityForm.value.citycode,
        latitude: this.cityForm.value.latitude,
        longitude: this.cityForm.value.longitude,
      };

      if (this.cityForm.value.id) {
        this.apiservice
          .CommonPutApi("common/city/" + this.cityForm.value.id, payLoad)
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
        this.apiservice.CommonPostApi(payLoad, "common/city").subscribe({
          next: (res) => {
            const data = res.data;
            this.toasterService.success(res.type, data.message);
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

  deleteCity() {
    this.apiservice
      .CommonDeleteApi(this.cityForm.value.id, "common/city")
      .subscribe((res) => {
        const data = res.data;
        this.toasterService.success(res.type, data.message);
        this.goBackBtn();
      });
  }

  getStateInitial(event) {
    if (event) {
      this.apiservice.CommonGetApi("common/list/state/" + event).subscribe({
        next: (res) => {
          this.states = res.data.states;
        },
        error: (error) => {
          this.toasterService.danger(error.error.message);
        },
      });
    }
  }

  getState(event) {
    if (event) {
      this.apiservice.CommonGetApi("common/list/state/" + event).subscribe({
        next: (res) => {
          this.states = res.data.states;
        },
        error: (error) => {
          this.toasterService.danger(error.error.message);
        },
      });
    }
    this.cityForm.patchValue({
      state_id: null,
      cityname: "",
      citycode: "",
    });
  }

  getCity(event) {
    this.cityForm.patchValue({
      cityname: "",
      citycode: "",
    });
  }

  openDeleteDialog(dialog: TemplateRef<any>) {
    this.cityDeleteDialogClose = this.dialogService.open(dialog, {
      autoFocus: false,
      closeOnBackdropClick:
        featuresSettings.Nb_dialogbox_close_while_click_outside,
    });
  }

  deletePopUpData = {
    title: this.translate.instant("CITY.DELETECITY"),
    data:
      this.translate.instant("COMMON.AREYOUSURE") +
      " " +
      this.translate.instant("CITY.CITY"),
  };

  closeDeletePopup(event: string) {
    if (event === "close") {
      this.cityDeleteDialogClose.close();
    } else {
      this.deleteCity();
    }
  }
}
