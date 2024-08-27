import {
  Component,
  OnInit,
  OnDestroy,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn,
  ValidationErrors,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { DataService } from "../../data.service";
import {
  environment,
  CommonData,
  featuresSettings,
} from "../../../../environments/environment";
import { ApiService } from "../../api.service";
import {
  NbDialogService,
  NbMenuService,
  NbToastrService,
} from "@nebular/theme";
import { Location } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";
import { Rider } from "../../../@theme/interface/interface";

@Component({
  selector: "ngx-add-rider",
  templateUrl: "./add-rider.component.html",
  styleUrls: ["./add-rider.component.scss"],
  // styles: [
  //   `
  //     nb-card {
  //       transform: translate3d(0, 0, 0);
  //     }
  //   `
  // ]
})
export class AddRiderComponent implements OnInit, OnDestroy {
  @ViewChild("DeleteDialog") deleteDialog: TemplateRef<any>;
  @ViewChild("ChangePasswordDialog") changePasswordDialog: TemplateRef<any>;
  items = [
    {
      icon: "person-done-outline",
      title: this.translate.instant("RIDER.ACTIVERIDER"),
    },
    {
      icon: "person-delete-outline",
      title: this.translate.instant("RIDER.INACTIVERIDER"),
    },
    {
      icon: "sync-outline",
      title: this.translate.instant("COMMON.RESETPASSWORD"),
    },
    { icon: "trash-2", title: this.translate.instant("RIDER.DELETERIDER") },
  ];

  subscribeToMenuItem() {
    this.dialogObservable = this.menuService
      .onItemClick()
      .subscribe((event) => {
        if (event.item.title === this.translate.instant("RIDER.DELETERIDER")) {
          this.openDeleteDialog(this.deleteDialog);
        }
        if (
          event.item.title === this.translate.instant("COMMON.RESETPASSWORD")
        ) {
          this.openChangePasswordDialog(this.changePasswordDialog);
        }
      });
  }

  riderDeleteDialogClose: import("@nebular/theme").NbDialogRef<any>;
  riderChangePasswordDialogClose: import("@nebular/theme").NbDialogRef<any>;
  baseurl = environment.BASEURL;
  riderForm: FormGroup;
  changePasswordForm: FormGroup;
  genders = CommonData.gender;
  currencys = CommonData.currency;
  languages = CommonData.language;
  phoneCodes: any;
  countrys: any;
  states: any;
  cities: any;
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
  showPassword: boolean;
  showBackButton: boolean = true;
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
    this.initializeRiderForm();
    this.patchRiderForm();
    this.subscribeToMenuItem();
    this.ActivatedRoute.params.subscribe(params => {
      if (params['newTab']) {
        this.showBackButton = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.dialogObservable.unsubscribe();
    this.dataServiceSubscition.unsubscribe();
    if (this.riderDeleteDialogClose) this.riderDeleteDialogClose.close();
    if (this.riderChangePasswordDialogClose)
      this.riderChangePasswordDialogClose.close();
  }

  initializechangepasswordForm() {
    this.changePasswordForm = new FormGroup(
      {
        newPassword: new FormControl("", [
          Validators.required,
          Validators.pattern(featuresSettings.PasswordPattern),
        ]),
        confirmNewPassword: new FormControl("", [Validators.required]),
      },
      {
        validators: this.NewMatchPassword,
      }
    );
  }
  get newPassword() {
    return this.changePasswordForm.get("newPassword");
  }
  get confirmNewPassword() {
    return this.changePasswordForm.get("confirmNewPassword");
  }

  initializeRiderForm() {
    this.riderForm = new FormGroup(
      {
        id: new FormControl(""),
        fname: new FormControl("", [
          Validators.required,
          Validators.pattern("[a-zA-Z ]*"),
        ]),
        lname: new FormControl("", [
          Validators.required,
          Validators.pattern("[a-zA-Z ]*"),
        ]),
        phoneCode: new FormControl(null, Validators.required),
        phone: new FormControl("", [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(15),
          Validators.pattern("^[0-9]{8,15}$"),
        ]),
        email: new FormControl("", [Validators.email, Validators.required]),
        gender: new FormControl("", Validators.required),
        currency: new FormControl(null),
        language: new FormControl(null, Validators.required),
        country: new FormControl(null, Validators.required),
        state: new FormControl(null, Validators.required),
        city: new FormControl(null, Validators.required),
        password: new FormControl("", [
          Validators.required,
          Validators.pattern(featuresSettings.PasswordPattern),
        ]),
        confirmPassword: new FormControl("", [Validators.required]),
        image: new FormControl("", Validators.required),
        fileSource: new FormControl(""),
        emailVerified: new FormControl(true),
        phoneVerified: new FormControl(true),
      },
      {
        validators: this.MatchPassword,
      }
    );
    this.apiservice.CommonGetApi("common/list/country").subscribe({
      next: (res) => {
        this.countrys = res.data.countries;
        this.phoneCodes = res.data.countries;
      },
      error: (error) => {
        this.toasterService.danger(error.error.message);
      },
    });
  }

  get fname() {
    return this.riderForm.get("fname");
  }
  get lname() {
    return this.riderForm.get("lname");
  }
  get phoneCode() {
    return this.riderForm.get("phoneCode");
  }
  get phone() {
    return this.riderForm.get("phone");
  }
  get email() {
    return this.riderForm.get("email");
  }
  get gender() {
    return this.riderForm.get("gender");
  }
  get language() {
    return this.riderForm.get("language");
  }
  get country() {
    return this.riderForm.get("country");
  }
  get state() {
    return this.riderForm.get("state");
  }
  get city() {
    return this.riderForm.get("city");
  }
  get password() {
    return this.riderForm.get("password");
  }
  get confirmPassword() {
    return this.riderForm.get("confirmPassword");
  }
  get image() {
    return this.riderForm.get("image");
  }

  patchRiderForm(): void {
    this.dataServiceSubscition = this.dataService
      .getNewRowInfo()
      .subscribe((data) => {
        const rowData: Rider = data;
        if (JSON.stringify(rowData) !== "{}") {
          this.riderForm.get("password").clearValidators();
          this.riderForm.get("password").updateValueAndValidity();
          this.riderForm.get("confirmPassword").clearValidators();
          this.riderForm.get("confirmPassword").updateValueAndValidity();
          this.riderForm.patchValue({
            id: rowData._id,
            fname: rowData.fname,
            lname: rowData.lname,
            phoneCode: rowData.phoneCode,
            phone: rowData.phone,
            email: rowData.email,
            gender: rowData.gender,
            currency: rowData.currency,
            language: rowData.language,
            country: rowData.country,
            state: rowData.state,
            city: rowData.city,
            password: rowData.password,
            confirmPassword: rowData.confirmPassword,
            image: this.baseurl + rowData.profile,
            // emailVerified: rowData.emailVerified,
            // phoneVerified: rowData.phoneVerified,
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
      this.apiservice.CommonGetApi("common/customer/" + id).subscribe((res) => {
        const data = res.data.customer[0];
        this.dataService.setNewRowInfo(data);
      });
      this.countryid();
    }
  }

  countryid() {
    if (this.riderForm.value.country) {
      this.getStateInitial(this.riderForm.value.country);
    }
  }

  goBackBtn() {
    this.location.back();
  }

  onChange(file: FileList) {
    let fileToUpload = file.item(0);

    let reader = new FileReader();
    reader.onload = (event: any) => {
      let imageUrl = event.target.result;

      this.riderForm.patchValue({
        image: imageUrl,
        fileSource: file[0],
      });
    };
    reader.readAsDataURL(fileToUpload);
  }

  addOrEditRider() {
    if (this.riderForm.invalid) {
      this.riderForm.markAllAsTouched();
    } else {
      const formData = new FormData();
      formData.append("_id", this.riderForm.value.id);
      formData.append("fname", this.riderForm.value.fname);
      formData.append("lname", this.riderForm.value.lname);
      formData.append("phoneCode", this.riderForm.value.phoneCode);
      formData.append("phone", this.riderForm.value.phone);
      formData.append("email", this.riderForm.value.email);
      formData.append("gender", this.riderForm.value.gender);
      formData.append("currency", this.riderForm.value.currency);
      formData.append("language", this.riderForm.value.language);
      formData.append("country", this.riderForm.value.country);
      formData.append("state", this.riderForm.value.state);
      formData.append("city", this.riderForm.value.city);
      formData.append("password", this.riderForm.value.password);
      formData.append("confirmPassword", this.riderForm.value.confirmPassword);
      formData.append("file", this.riderForm.value.fileSource);
      formData.append("emailVerified", this.riderForm.value.emailVerified);
      formData.append("phoneVerified", this.riderForm.value.phoneVerified);

      if (this.riderForm.value.id) {
        this.apiservice
          .CommonPutApi("common/customer/" + this.riderForm.value.id, formData)
          .subscribe({
            next: (res) => {
              const data = res.data;
              // this.riderForm.patchValue({
              //   image: this.baseurl + data.onboarding.image,
              // });
              this.toasterService.success(res.type, data.message);
            },
            error: (error) => {
              this.toasterService.danger(error.error.message);
            },
          });
      } else {
        this.apiservice.CommonPostApi(formData, "common/customer").subscribe({
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

  ChangePassword() {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
    } else {
      const payLoad = {
        _id: this.riderForm.value.id,
        newpassword: this.changePasswordForm.value.newPassword,
        verifyFrom: "CHANGEPASSWORD",
        // confirmPassword: this.changePasswordForm.value.confirmNewPassword,
      };

      this.apiservice
        .CommonPostApi(payLoad, "common/customer/changePassword")
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

  deleteRider() {
    this.apiservice
      .CommonDeleteApi(this.riderForm.value.id, "common/customer")
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
    if (this.riderForm.value.state) {
      this.getCityInitial(this.riderForm.value.state);
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
    this.riderForm.patchValue({
      state: null,
      city: null,
    });
    this.states = [];
    this.cities = [];
  }

  getCityInitial(event) {
    if (event) {
      this.apiservice
        .CommonGetApi(
          "common/list/city/" + this.riderForm.value.country + "/" + event
        )
        .subscribe({
          next: (res) => {
            this.cities = res.data.cities;
          },
          error: (error) => {
            this.toasterService.danger(error.error.message);
          },
        });
    }
  }

  getCity(event) {
    if (event) {
      this.apiservice
        .CommonGetApi(
          "common/list/city/" + this.riderForm.value.country + "/" + event
        )
        .subscribe({
          next: (res) => {
            this.cities = res.data.cities;
          },
          error: (error) => {
            this.toasterService.danger(error.error.message);
          },
        });
    }
    this.riderForm.patchValue({
      city: null,
    });
    this.cities = [];
  }

  MatchPassword: ValidatorFn = (
    AC: AbstractControl
  ): ValidationErrors | null => {
    let password = AC.get("password").value;
    let verifyPassword = AC.get("confirmPassword").value;
    if (password != verifyPassword) {
      AC.get("confirmPassword")!.setErrors({ MatchPassword: true });
    } else {
      return;
    }
  };

  NewMatchPassword: ValidatorFn = (
    AC: AbstractControl
  ): ValidationErrors | null => {
    let newpassword = AC.get("newPassword").value;
    let newverifyPassword = AC.get("confirmNewPassword").value;
    if (newpassword != newverifyPassword) {
      AC.get("confirmNewPassword")!.setErrors({ NewMatchPassword: true });
    } else {
      return;
    }
  };

  emailValidation(data) {
    if (this.riderForm.controls.email.valid) {
      this.apiservice
        .EmailVerificationGetApi(data, "common/customer")
        .subscribe({
          next: (res) => {
            const data = res.data;
            this.toasterService.success(res.type, data.message);
          },
          error: (res) => {
            const data = res;
            this.toasterService.danger(data.error.message);
          },
        });
    }
  }

  phoneValidation() {
    const rider = this.riderForm.controls;
    if (rider.phone.valid && rider.phoneCode.valid) {
      this.apiservice
        .PhoneVerificationGetApi(
          rider.phone.value,
          rider.phoneCode.value,
          "common/customer"
        )
        .subscribe({
          next: (res) => {
            const data = res.data;
            this.toasterService.success(res.type, data.message);
          },
          error: (res) => {
            const data = res;
            this.toasterService.danger(data.error.message);
          },
        });
    } else {
      this.toasterService.danger("Enter both Phonecode & Phone no");
    }
  }

  openDeleteDialog(dialog: TemplateRef<any>) {
    this.riderDeleteDialogClose = this.dialogService.open(dialog, {
      autoFocus: false,
      closeOnBackdropClick:
        featuresSettings.Nb_dialogbox_close_while_click_outside,
    });
  }

  deletePopUpData = {
    title: this.translate.instant("RIDER.DELETERIDER"),
    data:
      this.translate.instant("COMMON.AREYOUSURE") +
      " " +
      this.translate.instant("RIDER.RIDER"),
  };

  closeDeletePopup(event: string) {
    if (event === "close") {
      this.riderDeleteDialogClose.close();
    } else {
      this.deleteRider();
    }
  }

  openChangePasswordDialog(dialog: TemplateRef<any>) {
    this.riderChangePasswordDialogClose = this.dialogService.open(dialog, {
      context:
        this.translate.instant("COMMON.AREYOUSURE") +
        " " +
        this.translate.instant("DRIVER.DRIVER"),
      autoFocus: false,
      closeOnBackdropClick:
        featuresSettings.Nb_dialogbox_close_while_click_outside,
    });
    this.initializechangepasswordForm();
  }
}
