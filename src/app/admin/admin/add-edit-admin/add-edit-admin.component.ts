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
import { Router, ActivatedRoute } from "@angular/router";
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
import { Admin } from "../../../@theme/interface/interface";

@Component({
  selector: "ngx-add-edit-admin",
  templateUrl: "./add-edit-admin.component.html",
  styleUrls: ["./add-edit-admin.component.scss"],
})
export class AddEditAdminComponent implements OnInit, OnDestroy {
  @ViewChild("DeleteDialog") deleteDialog: TemplateRef<any>;
  @ViewChild("ChangePasswordDialog") changePasswordDialog: TemplateRef<any>;
  items = [
    {
      icon: "sync-outline",
      title: this.translate.instant("COMMON.RESETPASSWORD"),
    },
    { icon: "trash-2", title: this.translate.instant("ADMIN.DELETEADMIN") },
  ];
  adminChangePasswordDialogClose: import("@nebular/theme").NbDialogRef<any>;
  adminDeleteDialogClose: import("@nebular/theme").NbDialogRef<any>;
  baseurl = environment.BASEURL;
  adminForm: FormGroup;
  changePasswordForm: FormGroup;
  genders = CommonData.gender;
  languages = CommonData.language;
  phoneCodes: any;
  adminTypes: any;
  serviceAvailableCities: any;
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
  ) {
    this.ActivatedRoute.data.subscribe((res) => {});
  }
  dialogObservable: any;

  ngOnInit(): void {
    this.initializeAdminForm();
    this.subscribeToMenuItem();
    this.patchAdminForm();
  }

  ngOnDestroy(): void {
    this.dialogObservable.unsubscribe();
    this.dataServiceSubscition.unsubscribe();
    if (this.adminChangePasswordDialogClose)
      this.adminChangePasswordDialogClose.close();
    if (this.adminDeleteDialogClose) this.adminDeleteDialogClose.close();
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

  initializeAdminForm(): void {
    this.adminForm = new FormGroup(
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
        serviceCity: new FormControl(null, Validators.required),
        adminType: new FormControl(null, Validators.required),
        emailVerified: new FormControl(true),
        phoneVerified: new FormControl(true),
      },
      {
        validators: this.MatchPassword,
      }
    );
    this.apiservice.CommonGetApi("creteria/serviceArea/list").subscribe({
      next: (res) => {
        this.serviceAvailableCities = res.data.serviceArea;
      },
      error: (error) => {
        this.toasterService.danger(error.error.message);
      },
    });
    this.apiservice.CommonGetApi("common/list/country").subscribe({
      next: (res) => {
        this.phoneCodes = res.data.countries;
      },
      error: (error) => {
        this.toasterService.danger(error.error.message);
      },
    });
    this.apiservice.CommonGetApi("common/adminGroup/list").subscribe({
      next: (res) => {
        this.adminTypes = res.data.adminGroup;
      },
      error: (error) => {
        this.toasterService.danger(error.error.message);
      },
    });
  }

  get fname() {
    return this.adminForm.get("fname");
  }
  get lname() {
    return this.adminForm.get("lname");
  }
  get phoneCode() {
    return this.adminForm.get("phoneCode");
  }
  get phone() {
    return this.adminForm.get("phone");
  }
  get email() {
    return this.adminForm.get("email");
  }
  get password() {
    return this.adminForm.get("password");
  }
  get adminType() {
    return this.adminForm.get("adminType");
  }
  get confirmPassword() {
    return this.adminForm.get("confirmPassword");
  }
  get serviceCity() {
    return this.adminForm.get("serviceCity");
  }
  get image() {
    return this.adminForm.get("image");
  }

  patchAdminForm(): void {
    this.dataServiceSubscition = this.dataService
      .getNewRowInfo()
      .subscribe((data) => {
        const rowData: Admin = data;
        if (JSON.stringify(rowData) !== "{}") {
          const rowData: Admin = data;
          this.adminForm.get("password").clearValidators();
          this.adminForm.get("password").updateValueAndValidity();
          this.adminForm.get("confirmPassword").clearValidators();
          this.adminForm.get("confirmPassword").updateValueAndValidity();
          this.adminForm.patchValue({
            id: rowData._id,
            fname: rowData.fname,
            lname: rowData.lname,
            phoneCode: rowData.phoneCode,
            phone: rowData.phone,
            email: rowData.email,
            // password: rowData.password,
            // confirmPassword: rowData.confirmPassword,
            image: this.baseurl + rowData.profile,
            adminType: rowData.group._id,
            serviceCity: rowData.scIds,
          });
        } else {
          this.dataFetchWhileReload();
        }
      });
  }

  dataFetchWhileReload() {
    let id = this.ActivatedRoute.snapshot.paramMap.get("id");
    if (id) {
      this.apiservice.CommonGetApi("common/admin/" + id).subscribe((res) => {
        const data = res.data.admin[0];
        this.dataService.setNewRowInfo(data);
      });
    }
  }

  subscribeToMenuItem() {
    this.dialogObservable = this.menuService
      .onItemClick()
      .subscribe((event) => {
        if (event.item.title === this.translate.instant("ADMIN.DELETEADMIN")) {
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
      this.adminForm.patchValue({
        image: imageUrl,
        fileSource: file[0],
      });
    };
    reader.readAsDataURL(fileToUpload);
  }

  addOrEditAdmin() {
    if (this.adminForm.invalid) {
      this.adminForm.markAllAsTouched();
    } else {
      const formData = new FormData();
      formData.append("fname", this.adminForm.value.fname);
      formData.append("lname", this.adminForm.value.lname);
      formData.append("phoneCode", this.adminForm.value.phoneCode);
      formData.append("phone", this.adminForm.value.phone);
      formData.append("email", this.adminForm.value.email);
      formData.append("password", this.adminForm.value.password);
      formData.append("confirmPassword", this.adminForm.value.confirmPassword);
      formData.append("group", this.adminForm.value.adminType);
      formData.append("scIds", this.adminForm.value.serviceCity);
      formData.append("file", this.adminForm.value.fileSource);
      formData.append("emailVerified", this.adminForm.value.emailVerified);
      formData.append("phoneVerified", this.adminForm.value.phoneVerified);
      if (this.adminForm.value.id) {
        this.apiservice
          .CommonPutApi("common/admin/" + this.adminForm.value.id, formData)
          .subscribe({
            next: (res) => {
              const data = res.data;
              // this.adminForm.patchValue({
              //   image: this.baseurl + data.onboarding.image,
              // });
              this.toasterService.success(res.type, data.message);
            },
            error: (error) => {
              this.toasterService.danger(error.error.message);
            },
          });
      } else {
        this.apiservice.CommonPostApi(formData, "common/admin").subscribe({
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
        _id: this.adminForm.value.id,
        password: this.changePasswordForm.value.newPassword,
        verifyFrom: "CHANGEPASSWORD",
      };
      this.apiservice
        .CommonPostApi(payLoad, "common/admin/changePassword")
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

  deleteAdmin() {
    this.apiservice
      .CommonDeleteApi(this.adminForm.value.id, "common/admin")
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
    if (this.adminForm.controls.email.valid) {
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
    const admin = this.adminForm.controls;
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
    this.adminDeleteDialogClose = this.dialogService.open(dialog, {
      autoFocus: false,
      closeOnBackdropClick:
        featuresSettings.Nb_dialogbox_close_while_click_outside,
    });
  }

  deletePopUpData = {
    title: this.translate.instant("ADMIN.DELETEADMIN"),
    data:
      this.translate.instant("COMMON.AREYOUSURE") +
      " " +
      this.translate.instant("ADMIN.ADMIN"),
  };

  closeDeletePopup(event: string) {
    if (event === "close") {
      this.adminDeleteDialogClose.close();
    } else {
      this.deleteAdmin();
    }
  }

  openChangePasswordDialog(dialog: TemplateRef<any>) {
    this.adminChangePasswordDialogClose = this.dialogService.open(dialog, {
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
