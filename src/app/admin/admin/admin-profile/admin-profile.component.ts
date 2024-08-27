import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DataService } from "../../data.service";
import { environment, CommonData } from "../../../../environments/environment";
import { ApiService } from "../../api.service";
import { NbToastrService } from "@nebular/theme";
import { TranslateService } from "@ngx-translate/core";
import { Admin } from "../../../@theme/interface/interface";

@Component({
  selector: "ngx-admin-profile",
  templateUrl: "./admin-profile.component.html",
  styleUrls: ["./admin-profile.component.scss"],
})
export class AdminProfileComponent implements OnInit, OnDestroy {
  baseurl = environment.BASEURL;
  adminForm: FormGroup;
  genders = CommonData.gender;
  phoneCodes: any;
  dataServiceSubscition: any;

  constructor(
    private dataService: DataService,
    private apiservice: ApiService,
    private toasterService: NbToastrService,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.initializeAdminForm();
    this.patchAdminForm();
  }

  ngOnDestroy(): void {
    this.dataServiceSubscition.unsubscribe();
  }

  initializeAdminForm(): void {
    this.adminForm = new FormGroup({
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
      image: new FormControl("", Validators.required),
      fileSource: new FormControl(""),
    });
    if (localStorage.getItem("AdminDetails")) {
      const user = JSON.parse(localStorage.getItem("AdminDetails"));
      this.apiservice.CommonGetApi("common/admin/" + user._id).subscribe({
        next: (res) => {
          this.dataService.setNewRowInfo(res.data.admin[0]);
        },
        error: (error) => {
          this.toasterService.danger(error.error.message);
        },
      });
    }
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
          this.adminForm.patchValue({
            id: rowData._id,
            fname: rowData.fname,
            lname: rowData.lname,
            phoneCode: rowData.phoneCode,
            phone: rowData.phone,
            email: rowData.email,
            image: this.baseurl + rowData.profile,
          });
        }
      });
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
      formData.append("file", this.adminForm.value.fileSource);
      this.apiservice
        .CommonPutApi("common/admin/" + this.adminForm.value.id, formData)
        .subscribe({
          next: (res) => {
            const data = res.data;
            this.toasterService.success(res.type, data.message);
          },
          error: (error) => {
            this.toasterService.danger(error.error.message);
          },
        });
    }
  }
}
