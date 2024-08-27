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
import { Currencies } from "../../../../@theme/interface/interface";
@Component({
  selector: 'ngx-add-currency',
  templateUrl: './add-currency.component.html',
  styleUrls: ['./add-currency.component.scss']
})
export class AddCurrencyComponent implements OnInit {

  @ViewChild("DeleteDialog") deleteDialog: TemplateRef<any>;
  items = [
    { icon: "trash-2", title: this.translate.instant("CURRENCY.DELETECURRENCY") },
  ];
  currencyDeleteDialogClose: import("@nebular/theme").NbDialogRef<any>;
  currencyForm: FormGroup;
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
  ) { }
  dialogObservable: any;
  ngOnInit(): void {
    this.initializeCurrencyForm();
    this.patchCurrencyForm();
    this.getAllCountries();
    this.subscribeToMenuItem();

  }

  ngOnDestroy(): void {
    this.dialogObservable.unsubscribe();
    this.dataServiceSubscition.unsubscribe();
    if (this.currencyDeleteDialogClose) this.currencyDeleteDialogClose.close();
  }

  initializeCurrencyForm() {
    this.currencyForm = new FormGroup({
      id: new FormControl(""),
      currencyName: new FormControl("", Validators.required),
      currencyCode: new FormControl("", Validators.required),
      countryname: new FormControl(null, Validators.required),
      symbol: new FormControl(null, Validators.required)
    });
  }
  get currencyName() {
    return this.currencyForm.get("currencyName");
  }

  get currencyCode() {
    return this.currencyForm.get("currencyCode");
  }

  get countryname() {
    return this.currencyForm.get("countryname");
  }
  get symbol() {
    return this.currencyForm.get("symbol");
  }

  patchCurrencyForm(): void {
    this.dataServiceSubscition = this.dataService
      .getNewRowInfo()
      .subscribe((data) => {
        this.dataCopy = data;
        const rowData: Currencies = data;
        if (JSON.stringify(rowData) !== "{}") {
          this.currencyForm.patchValue({
            id: rowData._id,
            currencyName: rowData.name,
            currencyCode: rowData.code,
            countryname: rowData.country._id,
            symbol: rowData.symbol
          });
        } else {
          this.dataFetchWhileReload();
        }
      });
  }

  dataFetchWhileReload() {
    let id = this.ActivatedRoute.snapshot.paramMap.get("id");
    if (id) {
      this.apiservice.CommonGetApi("common/currency/" + id).subscribe((res) => {
        const data = res.data.currency[0];
        this.dataService.setNewRowInfo(data);
      });
    }
  }

  subscribeToMenuItem() {
    this.dialogObservable = this.menuService
      .onItemClick()
      .subscribe((event) => {
        if (event.item.title === this.translate.instant("CURRENCY.DELETECURRENCY")) {
          this.openDeleteDialog(this.deleteDialog);
        }
      });
  }

  goBackBtn() {
    this.location.back();
  }


  addOrEditCurrency() {
    let currencyFormData = { ...this.currencyForm.value, country: this.countryId };
    if (this.currencyForm.invalid) {
      this.currencyForm.markAllAsTouched();
    } else {
      const payLoad = {
        id: this.currencyForm.value.id,
        name: this.currencyForm.value.currencyName,
        code: this.currencyForm.value.currencyCode,
        country: this.currencyForm.value.countryname,
        symbol: this.currencyForm.value.symbol
      };

      if (this.currencyForm.value.id) {
        this.apiservice
          .CommonPutApi("common/currency/" + this.currencyForm.value.id, payLoad)
          .subscribe({
            next: (res) => {
              this.toasterService.success(res.type, res.message);
            },
            error: (error) => {
              const data = error.error;
              this.toasterService.danger(error.type, data.message);
            },
          });
      } else {
        this.apiservice.CommonPostApi(payLoad, "common/currency").subscribe({
          next: (res) => {
            this.toasterService.success(res.type, res.message);
            this.router.navigate(["/admin/utility/view-currency"]);
            this.goBackBtn();
          },
          error: (error) => {
            const data = error.error;
            this.toasterService.danger(error.type, data.message);
          },
        });
      }
    }
  }
  deleteCurrency() {
    this.apiservice
      .CommonDeleteApi(this.currencyForm.value.id, "common/currency")
      .subscribe((res) => {
        const data = res.data;
        this.toasterService.success(res.type, data.message);
        this.goBackBtn();
      });
  }

  getAllCountries() {
    this.apiservice.CommonGetApi("common/country").subscribe({
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
    this.currencyForm.patchValue({
      currencyName: "",
      symbol: "",
      currencyCode: "",
    });
  }

  openDeleteDialog(dialog: TemplateRef<any>) {
    this.currencyDeleteDialogClose = this.dialogService.open(dialog, {
      autoFocus: false,
      closeOnBackdropClick:
        featuresSettings.Nb_dialogbox_close_while_click_outside,
    });
  }

  deletePopUpData = {
    title: this.translate.instant("CURRENCY.DELETECURRENCY"),
    data:
      this.translate.instant("COMMON.AREYOUSURE") +
      " " +
      this.translate.instant("CURRENCY.CURRENCY"),
  };

  closeDeletePopup(event: string) {
    if (event === "close") {
      this.currencyDeleteDialogClose.close();
    } else {
      this.deleteCurrency();
    }
  }
}

