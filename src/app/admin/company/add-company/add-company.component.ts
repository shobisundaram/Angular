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
  FormBuilder,
  Validators,
  AbstractControl,
  ValidatorFn,
  ValidationErrors,
} from "@angular/forms";
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
import { ActivatedRoute } from "@angular/router";
import { Company } from "../../../@theme/interface/interface";

@Component({
  selector: "ngx-add-company",
  templateUrl: "./add-company.component.html",
  styleUrls: ["./add-company.component.scss"],
})
export class AddCompanyComponent implements OnInit, OnDestroy {
  @ViewChild("DeleteDialog") deleteDialog: TemplateRef<any>;
  @ViewChild("ChangePasswordDialog") changePasswordDialog: TemplateRef<any>;
  items = [
    {
      icon: "sync-outline",
      title: this.translate.instant("COMMON.RESETPASSWORD"),
    },
    { icon: "trash-2", title: this.translate.instant("COMPANY.DELETECOMPANY") },
  ];
  companyChangePasswordDialogClose: import("@nebular/theme").NbDialogRef<any>;
  companyDeleteDialogClose: import("@nebular/theme").NbDialogRef<any>;
  baseurl = environment.BASEURL;
  companyForm: FormGroup;
  changePasswordForm: FormGroup;
  genders = CommonData.gender;
  languages = CommonData.language;
  phoneCodes: any;
  dataServiceSubscition: any;
  showPassword: boolean;

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
    this.initializeCompanyForm();
    this.patchCompanyForm();
    this.subscribeToMenuItem();
  }

  ngOnDestroy(): void {
    this.dialogObservable.unsubscribe();
    this.dataServiceSubscition.unsubscribe();
    if (this.companyChangePasswordDialogClose)
      this.companyChangePasswordDialogClose.close();
    if (this.companyDeleteDialogClose) this.companyDeleteDialogClose.close();
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

  initializeCompanyForm(): void {
    this.companyForm = new FormGroup(
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
        this.phoneCodes = res.data.countries;
      },
      error: (error) => {
        this.toasterService.danger(error.error.message);
      },
    });
  }

  get fname() {
    return this.companyForm.get("fname");
  }
  get lname() {
    return this.companyForm.get("lname");
  }
  get phoneCode() {
    return this.companyForm.get("phoneCode");
  }
  get phone() {
    return this.companyForm.get("phone");
  }
  get email() {
    return this.companyForm.get("email");
  }
  get password() {
    return this.companyForm.get("password");
  }
  get confirmPassword() {
    return this.companyForm.get("confirmPassword");
  }
  get image() {
    return this.companyForm.get("image");
  }

  patchCompanyForm(): void {
    this.dataServiceSubscition = this.dataService
      .getNewRowInfo()
      .subscribe((data) => {
        const rowData: Company = data;
        if (JSON.stringify(rowData) !== "{}") {
          this.companyForm.get("password").clearValidators();
          this.companyForm.get("password").updateValueAndValidity();
          this.companyForm.get("confirmPassword").clearValidators();
          this.companyForm.get("confirmPassword").updateValueAndValidity();
          this.companyForm.patchValue({
            id: rowData._id,
            fname: rowData.fname,
            lname: rowData.lname,
            phoneCode: rowData.phoneCode,
            phone: rowData.phone,
            email: rowData.email,
            password: rowData.password,
            confirmPassword: rowData.confirmPassword,
            image: this.baseurl + rowData.profile,
            // emailVerified: rowData.emailVerified,
            // phoneVerified: rowData.phoneVerified,
          });
        } else {
          this.dataFetchWhileReload();
        }
      });
  }

  dataFetchWhileReload() {
    let id = this.ActivatedRoute.snapshot.paramMap.get("id");
    if (id) {
      this.apiservice.CommonGetApi("common/company/" + id).subscribe((res) => {
        const data = res.data.company[0];
        this.dataService.setNewRowInfo(data);
      });
    }
  }

  subscribeToMenuItem() {
    this.dialogObservable = this.menuService
      .onItemClick()
      .subscribe((event) => {
        if (
          event.item.title === this.translate.instant("COMPANY.DELETECOMPANY")
        ) {
          this.openDeleteDialog(this.deleteDialog);
        }
        if (
          event.item.title === this.translate.instant("COMMON.RESETPASSWORD")
        ) {
          this.openChangePasswordDialog(this.changePasswordDialog);
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
      this.companyForm.patchValue({
        image: imageUrl,
        fileSource: file[0],
      });
    };
    reader.readAsDataURL(fileToUpload);
  }

  addOrEditCompany() {
    if (this.companyForm.invalid) {
      this.companyForm.markAllAsTouched();
    } else {
      const formData = new FormData();
      formData.append("fname", this.companyForm.value.fname);
      formData.append("lname", this.companyForm.value.lname);
      formData.append("phoneCode", this.companyForm.value.phoneCode);
      formData.append("phone", this.companyForm.value.phone);
      formData.append("email", this.companyForm.value.email);
      formData.append("password", this.companyForm.value.password);
      formData.append(
        "confirmPassword",
        this.companyForm.value.confirmPassword
      );
      formData.append("group", this.companyForm.value.adminType);
      formData.append("file", this.companyForm.value.fileSource);
      formData.append("emailVerified", this.companyForm.value.emailVerified);
      formData.append("phoneVerified", this.companyForm.value.phoneVerified);

      if (this.companyForm.value.id) {
        this.apiservice
          .CommonPutApi("common/company/" + this.companyForm.value.id, formData)
          .subscribe({
            next: (res) => {
              const data = res.data;
              // this.companyForm.patchValue({
              //   image: this.baseurl + data.onboarding.image,
              // });
              this.toasterService.success(res.type, data.message);
            },
            error: (error) => {
              this.toasterService.danger(error.error.message);
            },
          });
      } else {
        this.apiservice.CommonPostApi(formData, "common/company").subscribe({
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
        _id: this.companyForm.value.id,
        password: this.changePasswordForm.value.newPassword,
        verifyFrom: "CHANGEPASSWORD",
      };

      this.apiservice
        .CommonPostApi(payLoad, "common/company/changePassword")
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

  deleteCompany() {
    this.apiservice
      .CommonDeleteApi(this.companyForm.value.id, "common/company")
      .subscribe((res) => {
        const data = res.data;
        this.toasterService.success(res.type, data.message);
        this.goBackBtn();
      });
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
    if (this.companyForm.controls.email.valid) {
      this.apiservice.EmailVerificationGetApi(data, "common/admin").subscribe({
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
    const admin = this.companyForm.controls;
    if (admin.phone.valid && admin.phoneCode.valid) {
      this.apiservice
        .PhoneVerificationGetApi(
          admin.phone.value,
          admin.phoneCode.value,
          "common/admin"
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
    this.companyDeleteDialogClose = this.dialogService.open(dialog, {
      autoFocus: false,
      closeOnBackdropClick:
        featuresSettings.Nb_dialogbox_close_while_click_outside,
    });
  }

  deletePopUpData = {
    title: this.translate.instant("COMPANY.DELETECOMPANY"),
    data:
      this.translate.instant("COMMON.AREYOUSURE") +
      " " +
      this.translate.instant("COMPANY.COMPANY"),
  };

  closeDeletePopup(event: string) {
    if (event === "close") {
      this.companyDeleteDialogClose.close();
    } else {
      this.deleteCompany();
    }
  }

  openChangePasswordDialog(dialog: TemplateRef<any>) {
    this.companyChangePasswordDialogClose = this.dialogService.open(dialog, {
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
