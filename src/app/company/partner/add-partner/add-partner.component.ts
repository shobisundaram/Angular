import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { NbDialogService, NbMenuService, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { ServerDataSource } from 'ng2-smart-table';
import { Location } from "@angular/common";
import { CommonData, environment, featuresSettings } from '../../../../environments/environment';
import { Partner } from '../../../@theme/interface/interface';
import { CompanyDataService } from '../../company-data.service';
import { CompanyapiService } from '../../companyapi.service';
import * as moment from "moment";

@Component({
  selector: 'ngx-add-partner',
  templateUrl: './add-partner.component.html',
  styleUrls: ['./add-partner.component.scss']
})
export class AddPartnerComponent implements OnInit {
  baseurl = environment.BASEURL;
  settings = {
    pager: {
      display: true,
    },
    mode: "external",
    edit: {
      editButtonContent: '<i class="fa fa-edit table-edit-icon"></i>',
    },
    actions: { delete: false, add: false },
    columns: {
      registrationnumber: {
        title: this.translateService.instant(
          "VEHICLEADD.VEHICLENO/LICENCEPLATENO"
        ),
        type: "string",
      },
      modelname: {
        title: this.translateService.instant("VEHICLEADD.CARMAKE"),
        type: "string",
      },
      makename: {
        title: this.translateService.instant("VEHICLEADD.CARMODEL"),
        type: "string",
      },
      servicetypename: {
        title: this.translateService.instant("VEHICLEADD.VEHICLE/SERVICETYPE"),
        type: "string",
      },
    },
  };
  @ViewChild("DeleteDialog") DeleteDialog: TemplateRef<any>;
  @ViewChild("ChangePasswordDialog") changePasswordDialog: TemplateRef<any>;
  @ViewChild("DocumentUpdateDialog") DocumentUpdateDialog: TemplateRef<any>;
  @ViewChild("DriverDocumentRejectDialog") driverDocumentRejectDialog: TemplateRef<any>;
  items = [
    {
      icon: "person-done-outline",
      title: this.translateService.instant("DRIVER.ACTIVEDRIVER"),
    },
    {
      icon: "person-delete-outline",
      title: this.translateService.instant("DRIVER.INACTIVEDRIVER"),
    },
    {
      icon: "sync-outline",
      title: this.translateService.instant("COMMON.RESETPASSWORD"),
    },
    { icon: "trash-2", title: this.translateService.instant("DRIVER.DELETEDRIVER") },
  ];
  driverItems = [
    {
      icon: "plus-outline",
      title: this.translateService.instant("DRIVER.ADDNEWDRIVERTAXI"),
    },
  ];
  documentItems = [
    {
      icon: "edit-2-outline",
      title: this.translateService.instant("COMMON.ACTION"),
    },
    {
      icon: "checkmark-circle-2-outline",
      title: this.translateService.instant("COMMON.ACCEPT"),
    },
    {
      icon: "close-circle-outline",
      title: this.translateService.instant("COMMON.DECLINED"),
    },
  ];
  source: ServerDataSource;
  needDocuments: any;
  fieldName: any;
  driverChangePasswordDialogClose: import("@nebular/theme").NbDialogRef<any>;
  driverDeleteDialogClose: import("@nebular/theme").NbDialogRef<any>;
  driverDocumentRejectDialogClose: import("@nebular/theme").NbDialogRef<any>;
  driverDocumentDialogClose: import("@nebular/theme").NbDialogRef<any>;
  dialogObservable: any;

  driverForm: FormGroup;
  driverDocumentRejectForm: FormGroup;
  changePasswordForm: FormGroup;

  genders = CommonData.gender;
  currencys = CommonData.currency;
  languages = CommonData.language;
  driverStatus: any;
  serviceAvailableCities: any;
  countrys: any;
  states: any;
  cities: any;
  phoneCodes: any;
  dataServiceSubscition: any;
  test: any={};
  constructor(
    private menuService: NbMenuService,
    private translateService: TranslateService,
    private apiservice: CompanyapiService,
    private ActivatedRoute: ActivatedRoute,
    private http: HttpClient,
    private toasterService: NbToastrService,
    private dialogService: NbDialogService,
    private router: Router,
    private location: Location,
    private dataService: CompanyDataService
  ) { 
    Object.keys(this.settings.columns).forEach(key => {
      this.settings.columns[key].sort = featuresSettings.TableSort;
    });
  }

  ngOnInit(): void {
    this.initializedriverForm();
    this.initializeDriverDocumentRejectForm();
    this.patchdriverForm();
    this.subscribeToMenuItem();
    this.countryid();
  }

  initializedriverForm() {
    this.driverForm = new FormGroup(
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
        driverCode: new FormControl(""),
        gender: new FormControl("", Validators.required),
        currency: new FormControl(null),
        language: new FormControl(null, Validators.required), //Data should come from backend as followed ["en", "ta"], to bind the data in editing page
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
        serviceCity: new FormControl(null, Validators.required),
        emailVerified: new FormControl(false),
        phoneVerified: new FormControl(false),
        selectedTaxis: new FormArray([]),
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
        this.countrys = res.data.countries;
        this.phoneCodes = res.data.countries;
      },
      error: (error) => {
        this.toasterService.danger(error.error.message);
      },
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

  initializeDriverDocumentRejectForm() {
    this.driverDocumentRejectForm = new FormGroup({
      reason: new FormControl("", [Validators.required]),
      name: new FormControl(""),
      docFor: new FormControl(""),
      partnerId: new FormControl(""),
      status: new FormControl(""),
    });
  }

  patchdriverForm(): void {
    this.dataServiceSubscition = this.dataService
      .getDriverDataInfo()
      .subscribe((data) => {
        console.log("ABCDEFGH", data);

        const rowData: Partner = data;
        if (JSON.stringify(rowData) !== "{}") {
          (this.driverStatus = rowData.status),
            this.driverForm.get("password").clearValidators();
          this.driverForm.get("password").updateValueAndValidity();
          this.driverForm.get("confirmPassword").clearValidators();
          this.driverForm.get("confirmPassword").updateValueAndValidity();
          this.driverForm.patchValue({
            id: rowData._id,
            fname: rowData.fname,
            lname: rowData.lname,
            phoneCode: rowData.phoneCode,
            phone: rowData.phone,
            email: rowData.email,
            driverCode: rowData.uniCode,
            gender: rowData.gender,
            currency: rowData.currency,
            language: rowData.language,
            country: rowData.country,
            state: rowData.state,
            city: rowData.city,
            password: rowData.password,
            confirmPassword: rowData.confirmPassword,
            image: this.baseurl + rowData.profile,
            serviceCity: rowData.scId[0],
            selectedTaxis: rowData.taxis,
            // emailVerified: rowData.emailVerified,
            // phoneVerified: rowData.phoneVerified,
          });
          this.source = new ServerDataSource(this.http, {
            endPoint:
              environment.API_ENDPOINT +
              "creteria/vehicle/partner/" +
              this.driverForm.value.id,
            dataKey: "data.Vehicle",
            pagerPageKey: "page",
            pagerLimitKey: "limit",
            totalKey: "data.total",
            filterFieldKey: "#field#",
          });
          this.apiservice
            .CommonGetApi("common/document/partner/" + this.driverForm.value.id)
            .subscribe((res) => {
              this.needDocuments = res.data.documents;
              this.checkExpiry();
            });
        } else {
          this.dataFetchWhileReload();
        }
      });
  }
  dataFetchWhileReload() {
    let id = this.ActivatedRoute.snapshot.paramMap.get("id");
    if (id) {
      this.apiservice.CommonGetApi("common/partner/" + id).subscribe((res) => {
        const data = res.data.partner[0];
        this.dataService.setDriverDataInfo(data);
      });
      this.source = new ServerDataSource(this.http, {
        endPoint: environment.API_ENDPOINT + "creteria/vehicle/" + id,
        dataKey: "data.Vehicle",
        pagerPageKey: "page",
        pagerLimitKey: "limit",
        totalKey: "data.total",
        filterFieldKey: "#field#",
      });
      this.countryid();
    }
  }

  subscribeToMenuItem() {
    this.dialogObservable = this.menuService
      .onItemClick()
      .subscribe((event) => {
        if (
          event.item.title === this.translateService.instant("DRIVER.ACTIVEDRIVER")
        ) {
          this.apiservice
            .CommonPostOneApiwithParams(
              "common/partner/partnerActive",
              this.driverForm.value.id
            )
            .subscribe({
              next: (res) => {
                this.toasterService.success(res.type, res.message);
                this.driverStatus = res.data.Data.status;
              },
              error: (error) => {
                this.toasterService.danger(error.error.message);
              },
            });
        }
        if (
          event.item.title === this.translateService.instant("DRIVER.INACTIVEDRIVER")
        ) {
          this.apiservice
            .CommonPostOneApiwithParams(
              "common/partner/partnerInactive",
              this.driverForm.value.id
            )
            .subscribe({
              next: (res) => {
                this.toasterService.danger(res.type, res.message);
                this.driverStatus = res.data.Data.status;
              },
              error: (error) => {
                this.toasterService.danger(error.error.message);
              },
            });
        }
        if (
          event.item.title === this.translateService.instant("DRIVER.DELETEDRIVER")
        ) {
          this.openDeleteDialog(this.DeleteDialog);
        }
        if (
          event.item.title === this.translateService.instant("COMMON.RESETPASSWORD")
        ) {
          this.openChangePasswordDialog(this.changePasswordDialog);
        }
        if (
          event.item.title === this.translateService.instant("DRIVER.ADDNEWDRIVERTAXI")
        ) {
          this.routetoAddTaxi();
        }
        if (event.tag && event.item.title == this.translateService.instant("COMMON.ACTION")) {
          let result = this.needDocuments.filter(
            (el) => el.indexName == event.tag
          );
          this.openDocumentUpdateDialog(this.DocumentUpdateDialog, result[0]);
        }
        if (event.tag && event.item.title == this.translateService.instant("COMMON.ACCEPT")) {
          const objectData = {
            name: event.tag,
            docFor: "driverDocs",
            partnerId: this.driverForm.value.id,
            status: "approved",
            reason: "",
          };
          this.apiservice
            .CommonPatchApi(objectData, "common/document/updateStatus")
            .subscribe({
              next: (res) => {
                const data = res.data;
                this.toasterService.success(res.type, res.message);
                this.documentApi();
              },
              error: (error) => {
                this.toasterService.danger(error.error.message);
              },
            });
        }
        if (event.tag && event.item.title == this.translateService.instant("COMMON.DECLINED")) {
          this.driverDocumentRejectForm.patchValue({
            name: event.tag,
            docFor: "driverDocs",
            partnerId: this.driverForm.value.id,
            status: "rejected",
          });
          this.openDriverDocumentRejectDialog(this.driverDocumentRejectDialog);
        }
      });
  }
  openDeleteDialog(dialog: TemplateRef<any>) {
    this.driverDeleteDialogClose = this.dialogService.open(dialog, {
      autoFocus: false,
      closeOnBackdropClick:
        featuresSettings.Nb_dialogbox_close_while_click_outside,
    });
  }
  openChangePasswordDialog(dialog: TemplateRef<any>) {
    this.driverChangePasswordDialogClose = this.dialogService.open(dialog, {
      context:
        this.translateService.instant("COMMON.AREYOUSURE") +
        " " +
        this.translateService.instant("DRIVER.DRIVER"),
      autoFocus: false,
      closeOnBackdropClick:
        featuresSettings.Nb_dialogbox_close_while_click_outside,
    });
    this.initializechangepasswordForm();
  }
  routetoAddTaxi(): void {
    this.router.navigate(["company/vehicle/add-edit-vehicle",
    {
      partnerId:  this.driverForm.value.id,
      code: this.driverForm.value.driverCode
    },]);
    this.dataService.setNewRowInfo({});
  }
  openDocumentUpdateDialog(dialog: TemplateRef<any>, dialogData) {
    this.driverDocumentDialogClose = this.dialogService.open(dialog, {
      context: dialogData,
      autoFocus: false,
      closeOnBackdropClick:
        featuresSettings.Nb_dialogbox_close_while_click_outside,
    });
    this.fieldName = dialogData.indexName;
  }
  documentApi() {
    this.apiservice
      .CommonGetApi("common/document/partner/" + this.driverForm.value.id)
      .subscribe((res) => {
        this.needDocuments = res.data.documents;
        this.checkExpiry();
      });
  }
  openDriverDocumentRejectDialog(dialog: TemplateRef<any>) {
    this.driverDocumentRejectDialogClose = this.dialogService.open(dialog, {
      context:
        this.translateService.instant("COMMON.AREYOUSURE") +
        " " +
        this.translateService.instant("DRIVER.DRIVER"),
      autoFocus: false,
      closeOnBackdropClick:
        featuresSettings.Nb_dialogbox_close_while_click_outside,
    });
    // this.initializeDriverDocumentRejectForm();
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

  countryid() {
    if (this.driverForm.value.country) {
      this.getStateInitial(this.driverForm.value.country);
    }
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
    if (this.driverForm.value.state) {
      this.getCityInitial(this.driverForm.value.state);
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
    this.driverForm.patchValue({
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
          "common/list/city/" + this.driverForm.value.country + "/" + event
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
          "common/list/city/" + this.driverForm.value.country + "/" + event
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
    this.driverForm.patchValue({
      city: null,
    });
    this.cities = [];
  }
  ngOnDestroy(): void {
    this.dialogObservable.unsubscribe();
    this.dataServiceSubscition.unsubscribe();
    if (this.driverChangePasswordDialogClose)
      this.driverChangePasswordDialogClose.close();
    if (this.driverDeleteDialogClose) this.driverDeleteDialogClose.close();
    if (this.driverDocumentRejectDialogClose)
      this.driverDocumentRejectDialogClose.close();
    if (this.driverDocumentDialogClose) this.driverDocumentDialogClose.close();
  }

  addOrEditDriver() {
    if (this.driverForm.invalid) {
      this.driverForm.markAllAsTouched();
    } else {
      const formData = new FormData();
      formData.append("_id", this.driverForm.value.id);
      formData.append("fname", this.driverForm.value.fname);
      formData.append("lname", this.driverForm.value.lname);
      formData.append("phoneCode", this.driverForm.value.phoneCode);
      formData.append("phone", this.driverForm.value.phone);
      formData.append("email", this.driverForm.value.email);
      formData.append("gender", this.driverForm.value.gender);
      formData.append("currency", this.driverForm.value.currency);
      formData.append("language", this.driverForm.value.language);
      formData.append("country", this.driverForm.value.country);
      formData.append("state", this.driverForm.value.state);
      formData.append("city", this.driverForm.value.city);
      formData.append("password", this.driverForm.value.password);
      formData.append("confirmPassword", this.driverForm.value.confirmPassword);
      formData.append("file", this.driverForm.value.fileSource);
      formData.append("scId", this.driverForm.value.serviceCity);
      formData.append("emailVerified", this.driverForm.value.emailVerified);
      formData.append("phoneVerified", this.driverForm.value.phoneVerified);

      if (this.driverForm.value.id) {
        this.apiservice
          .CommonPutApi("common/partner/" + this.driverForm.value.id, formData)
          .subscribe({
            next: (res) => {
              const data = res.data;
              // this.driverForm.patchValue({
              //   image: this.baseurl + data.onboarding.image,
              // });
              this.toasterService.success(res.type, data.message);
            },
            error: (error) => {
              this.toasterService.danger(error.error.message);
            },
          });
      } else {
        this.apiservice.CommonPostApi(formData, "common/partner").subscribe({
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
  goBackBtn() {
    this.location.back();
  }
  onChange(file: FileList) {
    let fileToUpload = file.item(0);

    let reader = new FileReader();
    reader.onload = (event: any) => {
      let imageUrl = event.target.result;

      this.driverForm.patchValue({
        image: imageUrl,
        fileSource: file[0],
      });
    };
    reader.readAsDataURL(fileToUpload);
  }
  onEdit(event) {
    this.dataService.setNewRowInfo(event);
    this.dataServiceSubscition.unsubscribe();
    this.router.navigate([
      "company/vehicle/add-edit-vehicle",
      { id: event._id },
    ]);
    // this.dataService.setNewRowInfo(event);
    // this.dataService.setNewRowInfo({});
  }
  documentActions(status, documentUploadedStatus) {
    if (status == "pending" && documentUploadedStatus) {
      this.documentItems = [
        {
          icon: "edit-2-outline",
          title: this.translateService.instant("COMMON.ACTION"),
        },
        {
          icon: "checkmark-circle-2-outline",
          title: this.translateService.instant("COMMON.ACCEPT"),
        },
        {
          icon: "close-circle-outline",
          title: this.translateService.instant("COMMON.DECLINED"),
        },
      ];
    } else if (status == "needAction" && !documentUploadedStatus) {
      this.documentItems = [
        {
          icon: "edit-2-outline",
          title: this.translateService.instant("COMMON.ACTION"),
        },
      ];
    } else if (status == "approved") {
      this.documentItems = [
        {
          icon: "edit-2-outline",
          title: this.translateService.instant("COMMON.ACTION"),
        },
        {
          icon: "close-circle-outline",
          title: this.translateService.instant("COMMON.DECLINED"),
        },
      ];
    } else if (status == "rejected") {
      this.documentItems = [
        {
          icon: "edit-2-outline",
          title: this.translateService.instant("COMMON.ACTION"),
        },
        {
          icon: "checkmark-circle-2-outline",
          title: this.translateService.instant("COMMON.ACCEPT"),
        },
      ];
    }
  }

  get fname() {
    return this.driverForm.get("fname");
  }
  get lname() {
    return this.driverForm.get("lname");
  }
  get phoneCode() {
    return this.driverForm.get("phoneCode");
  }
  get phone() {
    return this.driverForm.get("phone");
  }
  get email() {
    return this.driverForm.get("email");
  }
  get gender() {
    return this.driverForm.get("gender");
  }
  get language() {
    return this.driverForm.get("language");
  }
  get country() {
    return this.driverForm.get("country");
  }
  get state() {
    return this.driverForm.get("state");
  }
  get city() {
    return this.driverForm.get("city");
  }
  get password() {
    return this.driverForm.get("password");
  }
  get confirmPassword() {
    return this.driverForm.get("confirmPassword");
  }
  get image() {
    return this.driverForm.get("image");
  }
  get serviceCity() {
    return this.driverForm.get("serviceCity");
  }
  get newPassword() {
    return this.changePasswordForm.get("newPassword");
  }
  get confirmNewPassword() {
    return this.changePasswordForm.get("confirmNewPassword");
  }
  get reason() {
    return this.driverDocumentRejectForm.get("reason");
  }


  driverActions(status) {
    if (status == "Pending") {
      this.items = [
        {
          icon: "person-done-outline",
          title: this.translateService.instant("DRIVER.ACTIVEDRIVER"),
        },
        {
          icon: "person-delete-outline",
          title: this.translateService.instant("DRIVER.INACTIVEDRIVER"),
        },
        {
          icon: "sync-outline",
          title: this.translateService.instant("COMMON.RESETPASSWORD"),
        },
        {
          icon: "trash-2",
          title: this.translateService.instant("DRIVER.DELETEDRIVER"),
        },
      ];
    } else if (status == "Active") {
      this.items = [
        {
          icon: "person-delete-outline",
          title: this.translateService.instant("DRIVER.INACTIVEDRIVER"),
        },
        {
          icon: "sync-outline",
          title: this.translateService.instant("COMMON.RESETPASSWORD"),
        },
        {
          icon: "trash-2",
          title: this.translateService.instant("DRIVER.DELETEDRIVER"),
        },
      ];
    } else if (status == "Inactive") {
      this.items = [
        {
          icon: "person-done-outline",
          title: this.translateService.instant("DRIVER.ACTIVEDRIVER"),
        },
        {
          icon: "sync-outline",
          title: this.translateService.instant("COMMON.RESETPASSWORD"),
        },
        {
          icon: "trash-2",
          title: this.translateService.instant("DRIVER.DELETEDRIVER"),
        },
      ];
    }
  }
  ChangePassword() {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
    } else {
      const payLoad = {
        _id: this.driverForm.value.id,
        password: this.changePasswordForm.value.newPassword,
        verifyFrom: "CHANGEPASSWORD",
      };

      this.apiservice
        .CommonPostApi(payLoad, "common/partner/changePassword")
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

  driverDocumentUpdate() {
    const formData = new FormData();
    for (const property in this.test) {
      formData.append(property, this.test[property]);
    }
    this.apiservice
      .CommonPostApi(
        formData,
        "common/document/partner/" + this.driverForm.value.id
      )
      .subscribe({
        next: (res) => {
          const data = res.data;
          this.toasterService.success(res.type, data.message);
          this.documentApi();
          this.driverDocumentDialogClose.close();
        },
        error: (error) => {
          this.toasterService.danger(error.error.message);
        },
      });
  }

  onChangeForDriverDocumentUpload(event, name, type) {
    if (this.fieldName) {
      this.test["fieldName"] = this.fieldName;
    }
    if (type == "image") {
      this.test[name] = event.target.files[0];
    } else if (type == "date") {
      let date;
      date = moment(event).format("YYYY-MM-DD");
      this.test[name] = date;
    } else if (type == "string") {
      this.test[name] = event;
    }
  }
  driverDocumentRejectFunction() {
    if (this.driverDocumentRejectForm.invalid) {
      this.driverDocumentRejectForm.markAllAsTouched();
    } else {
      const payLoad = {
        name: this.driverDocumentRejectForm.value.name,
        docFor: this.driverDocumentRejectForm.value.docFor,
        partnerId: this.driverDocumentRejectForm.value.partnerId,
        status: this.driverDocumentRejectForm.value.status,
        reason: this.driverDocumentRejectForm.value.reason,
      };

      this.apiservice
        .CommonPatchApi(payLoad, "common/document/updateStatus")
        .subscribe({
          next: (res) => {
            const data = res.data;
            this.toasterService.success(res.type, res.message);
            this.documentApi();
            this.driverDocumentRejectDialogClose.close();
          },
          error: (error) => {
            this.toasterService.danger(error.error.message);
          },
        });
    }
  }
  deleteDriver() {
    this.apiservice
      .CommonDeleteApi(this.driverForm.value.id, "common/partner")
      .subscribe((res) => {
        const data = res.data;
        this.toasterService.success(res.type, data.message);
        this.goBackBtn();
      });
  }
  deletePopUpData = {
    title: this.translateService.instant("DRIVER.DELETEDRIVER"),
    data:
      this.translateService.instant("COMMON.AREYOUSURE") +
      " " +
      this.translateService.instant("DRIVER.DRIVER"),
  };
  closeDeletePopup(event: string) {
    if (event === "close") {
      this.driverDeleteDialogClose.close();
    } else {
      this.deleteDriver();
    }
  }
  isExpired(expiryDate: string | Date): boolean {
    const today = new Date();
    const expiry = new Date(expiryDate);
    return expiry <= today;
  }
  checkExpiry() {
    this.needDocuments.forEach(doc => {
      doc.expired = false; // Initialize expired flag
      
      doc.fields.forEach(data => {
        if (data.type === 'date') {
          const isExpired = this.isExpired(data.value);
          if (isExpired) {
            doc.expired = true; // Set expired flag for the document
          }
        }
      });
    });
  }
}
