import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DataService } from "../../data.service";
import {
  environment,
  Year_selection,
} from "../../../../environments/environment";
import { ApiService } from "../../api.service";
import { NbToastrService } from "@nebular/theme";
import { Location } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "ngx-add-drivertaxi",
  templateUrl: "./add-drivertaxi.component.html",
  styleUrls: ["./add-drivertaxi.component.scss"],
})
export class AddDrivertaxiComponent implements OnInit, OnDestroy {
  baseurl = environment.BASEURL;
  driverTaxiForm: FormGroup;
  makes: any;
  models: any;
  servicetypes: any;
  years: any;
  constructor(
    private dataService: DataService,
    private apiservice: ApiService,
    private toasterService: NbToastrService,
    private location: Location,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.initializedriverForm();
    this.patchdriverForm();
    this.getDriverIdName();
  }

  ngOnDestroy(): void {
    this.dataService.setDriverDataInfo({});
  }

  getDriverIdName() {
    this.dataService.getDriverDataInfo().subscribe((data) => {
      const rowData = data;
      if (JSON.stringify(rowData) !== "{}") {
        this.driverTaxiForm.patchValue({
          name: rowData.name,
        });
      }
    });
  }

  initializedriverForm() {
    this.driverTaxiForm = new FormGroup({
      id: new FormControl(""),
      name: new FormControl(""),
      regno: new FormControl("", Validators.required),
      make: new FormControl(null, Validators.required),
      model: new FormControl(null, Validators.required),
      servicetype: new FormControl(null, Validators.required),
      year: new FormControl(null, Validators.required),
      color: new FormControl("", Validators.required),
    });
    this.apiservice.CommonGetApi("common/make").subscribe({
      next: (res) => {
        this.makes = res.data.makes;
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
  }
  get regno() {
    return this.driverTaxiForm.get("regno");
  }
  get make() {
    return this.driverTaxiForm.get("make");
  }
  get model() {
    return this.driverTaxiForm.get("model");
  }
  get servicetype() {
    return this.driverTaxiForm.get("servicetype");
  }
  get year() {
    return this.driverTaxiForm.get("year");
  }
  get color() {
    return this.driverTaxiForm.get("color");
  }

  patchdriverForm(): void {
    this.dataService.getNewRowInfo().subscribe((data) => {
      const rowData = data;
      if (JSON.stringify(rowData) !== "{}") {
        this.driverTaxiForm.patchValue({
          id: rowData._id,
          regno: rowData.regno,
          make: rowData.fname,
          model: rowData.lname,
          servicetype: rowData.phoneCode,
          year: rowData.phone,
          color: rowData.email,
        });
      }
    });
  }

  getModel(event) {
    if (event) {
      this.apiservice.CommonGetApi("common/model/" + event).subscribe({
        next: (res) => {
          this.models = res.data.models;
        },
        error: (error) => {
          this.toasterService.danger(error.error.message);
        },
      });
    }
    this.driverTaxiForm.patchValue({
      model: null,
    });
  }

  goBackBtn() {
    this.location.back();
  }

  addOrEditDriverTaxi() {
    if (this.driverTaxiForm.invalid) {
      this.driverTaxiForm.markAllAsTouched();
    } else {
      const payLoad = {
        registrationnumber: this.driverTaxiForm.value.regno,
        makeid: this.driverTaxiForm.value.make,
        model: this.driverTaxiForm.value.model,
        year: this.driverTaxiForm.value.year,
        color: this.driverTaxiForm.value.color,
        servicetype: this.driverTaxiForm.value.servicetype,
      };

      if (this.driverTaxiForm.value.id) {
      } else {
        this.apiservice.CommonPostApi(payLoad, "creteria/vehicle").subscribe({
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
}
