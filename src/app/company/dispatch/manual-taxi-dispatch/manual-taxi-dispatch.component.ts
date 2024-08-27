import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {
  environment,
  CommonData,
  featuresSettings,
  AppSettings,
} from "../../../../environments/environment";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { TranslateService } from "@ngx-translate/core";
import * as moment from "moment";
import { Address } from "ngx-google-places-autocomplete/objects/address";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { CompanyapiService } from "../../companyapi.service";
import { CompanyDataService } from "../../company-data.service";
@Component({
  selector: "ngx-manual-taxi-dispatch",
  templateUrl: "./manual-taxi-dispatch.component.html",
  styleUrls: ["./manual-taxi-dispatch.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ManualTaxiDispatchComponent implements OnInit {
  @ViewChild('vehicleSelect') vehicleSelect: ElementRef;
  @ViewChild("TripInvoiceDialog") TripInvoiceDialog: TemplateRef<any>;
  TripInvoiceDialogClose:  import("@nebular/theme").NbDialogRef<any>;
  baseurl = environment.BASEURL;
  phoneCodes: any;
  tripTypes = CommonData.tripType1;
  dispatchForm: FormGroup;
  dropdownSettings = {
    singleSelection: false,
    idField: "scId",
    textField: "name",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    itemsShowLimit: 3,
    allowSearchFilter: true,
  };
  options = {
    bounds: undefined,
    fields: [],
    strictBounds: false,
    types: ["address"],
    origin: undefined,
    componentRestrictions: undefined,
  };
  pickupLat: any;
  pickupLang: any;
  dropLat: any;
  dropLang: any;
  selectVehicles: any;
  fareDetails: any;
  defaultCur = AppSettings.defaultcur;
  defaultUnit = featuresSettings.distanceUnit;
  isDisabled: boolean = true;
  bookingTypes= CommonData.bookingType
  AssignmentTypes = CommonData.AssignmentType
  rideLaterDateArray: any;
  isRiderBookingType: boolean;
  minDate: string;
  maxDate: string;
  availableTimes: string[];
  dataServiceSubscition: any;
  id: string;
  TripNo: any;
  requestId: any;

  constructor(
    private dataService: CompanyDataService,
    private apiservice: CompanyapiService,
    private toasterService: NbToastrService,
    public translate: TranslateService,
    private ActivatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private dialogService: NbDialogService,
    // public mapsAPILoader: MapsAPILoader
    private ngZone: NgZone
  ) { 
    // this.dataService.setNewRowInfo({});
  }

  ngOnInit(): void {
    this.initializeDispatchForm();
    this.fareDetailsList();
    if(this.ActivatedRoute.snapshot.paramMap.get("id")){
    this.patchDispatchForm();
    }
    // this.mapsAPILoader.load().then(() => {
    //   this.autocompletePlaces();
    // });
    this.apiservice.CommonGetApi("common/list/country").subscribe({
      next: (res) => {
        this.phoneCodes = res.data.countries;
      },
      error: (error) => {
        this.toasterService.danger(error.error.message);
      },
    });
    const currentDate = new Date();
    this.minDate = this.formatDate(currentDate);
    this.maxDate = this.formatDate(new Date(currentDate.setDate(currentDate.getDate() + 7)));
    // this.dispatchForm.get('tripDate')?.valueChanges.subscribe((date) => {
    //   this.updateAvailableTimes(date);
    // });
    this.dispatchForm.get('tripDate')?.valueChanges.subscribe((date) => {
      this.updateAvailableTimes(date);
    });
    this.id = this.ActivatedRoute.snapshot.paramMap.get("id");
  }

  ngOnDestroy(): void {
    this.dataService.setNewRowInfo({});
    if (this.dataServiceSubscition) {
      this.dataServiceSubscition.unsubscribe();
    }

  }

  searchBox1: google.maps.places.Autocomplete;
  searchBox2: google.maps.places.Autocomplete;
  ngAfterViewInit() {
    this.searchBox1 = new google.maps.places.Autocomplete(
      document.getElementById("searchBox1") as HTMLInputElement
    );

    this.searchBox2 = new google.maps.places.Autocomplete(
      document.getElementById("searchBox2") as HTMLInputElement
    );

    this.searchBox1.addListener("place_changed", () => {
      this.ngZone.run(() => {
        const place = this.searchBox1.getPlace();
        (this.pickupLat = place.geometry.location.lat()),
          (this.pickupLang = place.geometry.location.lng())
      });
    });

    this.searchBox2.addListener("place_changed", () => {
      this.ngZone.run(() => {
        const place = this.searchBox2.getPlace();
        (this.dropLat = place.geometry.location.lat()),
          (this.dropLang = place.geometry.location.lng())
      });
    });
  }

  fareDetailsList() {
    this.fareDetails = {
      fareType_est: "N/A",
      dist_est: 0,
      currency: this.defaultCur,
      distfare_est: this.amountToBeFloater(0),
      base_est: this.amountToBeFloater(0),
      booking_est: this.amountToBeFloater(0),
      waitingRate: 0,
      waitingTime: "N/A",
      waitingCharge_est: this.amountToBeFloater(0),
      timeRate: this.amountToBeFloater(0),
      time: "N/A",
      timefare_est: this.amountToBeFloater(0),
      minFareAdded_est: this.amountToBeFloater(0),
      tax_est: this.amountToBeFloater(0),
      surgeReason: "N/A",
      surgeAmt_est: this.amountToBeFloater(0),
      discountName: "N/A",
      discountPercentage: 0,
      detect_est: this.amountToBeFloater(0),
      cost_est: this.amountToBeFloater(0),
      tips_est: this.amountToBeFloater(0),
      roundOff_est: this.amountToBeFloater(0),
      actualcost_est: this.amountToBeFloater(0),
    };
  }

  initializeDispatchForm() {
    this.dispatchForm = new FormGroup({
      phoneCode: new FormControl(null, Validators.required),
      phone: new FormControl("", [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(15),
        Validators.pattern("^[0-9]{8,15}$"),
      ]),
      name: new FormControl("", Validators.required),
      email: new FormControl(""),
      customerId: new FormControl(""),
      types: new FormControl(null, Validators.required),
      pickupLocation: new FormControl("", Validators.required),
      dropLocation: new FormControl("", Validators.required),
      enter_promocode: new FormControl(""),
      vehicleId: new FormControl(null),
      bookingType: new FormControl('rideNow'),
      assignType: new FormControl(""),
      // tripDate: new FormControl(''),
      // tripTime: new FormControl('')
      tripDate: new FormControl('', this.dateWithinNext7DaysValidator),
      tripTime: new FormControl('')
    });
    this.selectVehicles = null;
  }
  patchDispatchForm(): void {
    this.dataServiceSubscition = 
      this.dataService
      .getNewRowInfo()
      .subscribe((data)=>{
        const rowData: any = data;
        if (JSON.stringify(rowData) !== "{}") {
          this.pickupLat = rowData.estimation.startcoords[1],
          this.pickupLang = rowData.estimation.startcoords[0],
          this.dropLat = rowData.estimation.endcoords[1],
          this.dropLang = rowData.estimation.endcoords[0]
          this.dispatchForm.patchValue({
            phoneCode: rowData.customer.phoneCode,
            phone: rowData.customer.phoneNo,
            name: rowData.customer.name ,
            email: rowData.customer.email,
            types: rowData.module,
            pickupLocation: rowData.estimation.start,
            dropLocation: rowData.estimation.end,
            vehicleId: rowData.serviceType,
          })
          this.doCheckRiderPhoneAlreadyExistsOrNot()
          this.getAvailableVehicles()
        }
        else {
          this.dataFetchWhileReload();
        }
      })
  }
  
  dataFetchWhileReload() {
    let id = this.ActivatedRoute.snapshot.paramMap.get("id");
    if (id) {
      this.apiservice.CommonGetApi("services/request?id=" + id).subscribe((res) => {
        const data = res.data.requestData;
        this.dataService.setNewRowInfo(data);
      });
    }
  }
  onVehicleIdChange(vehicleId: string): void {
    // Create a mock event object that contains the necessary data
    const event = {
      target: {
        value: vehicleId
      }
    };
    // Call the setEstimation method with the mock event
    this.setEstimation(event);
  }
  get phoneCode() {
    return this.dispatchForm.get("phoneCode");
  }
  get phone() {
    return this.dispatchForm.get("phone");
  }
  get name() {
    return this.dispatchForm.get("name");
  }
  get types() {
    return this.dispatchForm.get("types");
  }
  get pickupLocation() {
    return this.dispatchForm.get("pickupLocation");
  }
  get dropLocation() {
    return this.dispatchForm.get("dropLocation");
  }
  get bookingType(){
    return this.dispatchForm.get("bookingType");
  }
  get tripDate(){
    return this.dispatchForm.get("tripDate");
  }
  get tripTime(){
    return this.dispatchForm.get("tripTime");
  }

  doCheckRiderPhoneAlreadyExistsOrNot() {
    const encodePhoneCode = encodeURIComponent(
      this.dispatchForm.value.phoneCode
    );

    let queryParams = "services/request/getcustomerDetails";
    if (encodePhoneCode) {
      queryParams += "?phoneCode=" + encodePhoneCode;
    }
    if (this.dispatchForm.value.phone) {
      queryParams += "&phone=" + this.dispatchForm.value.phone;
    }

    this.apiservice.CommonGetApi(queryParams).subscribe({
      next: (res) => {
        this.toasterService.success(res.type, res.data.message);
        this.dispatchForm.patchValue({
          name: res.data.Customer.fname + " " + res.data.Customer.lname,
          email: res.data.Customer.email,
          customerId: res.data.Customer._id,
        });
      },
      error: (error) => {
        this.toasterService.danger(error.error.message);
      },
    });
  }

  // listenPickupLocation(address: Address) {
  //   console.log("PICKUP", address);

  //   this.pickupLat = address.geometry.location.lat();
  //   this.pickupLang = address.geometry.location.lng();
  // }

  // listenDropLocation(address: Address) {
  //   console.log("DROP", address);

  //   this.dropLat = address.geometry.location.lat();
  //   this.dropLang = address.geometry.location.lng();
  // }

  getAvailableVehicles() {
    let queryParams = "services/estimation/daily";
    if (this.pickupLat) {
      queryParams += "?pickupLat=" + this.pickupLat;
    }
    if (this.pickupLang) {
      queryParams += "&pickupLng=" + this.pickupLang;
    }
    if (this.dropLat) {
      queryParams += "&dropLat=" + this.dropLat;
    }
    if (this.dropLang) {
      queryParams += "&dropLng=" + this.dropLang;
    }
    if (this.dispatchForm.value.enter_promocode) {
      queryParams += "&coupon=" + this.dispatchForm.value.enter_promocode;
    }
    queryParams += "&time=" + "";

    this.apiservice.CommonGetApi(queryParams).subscribe({
      next: (res) => {
        this.isDisabled = false;
        this.selectVehicles = res.data.serviceTypes;
          const selectedVehicle = this.selectVehicles.find(vehicle => vehicle.vehicleId === this.dispatchForm.value.vehicleId);
          if (selectedVehicle) {
            this.dispatchForm.get('vehicleId').setValue(selectedVehicle);
            this.setEstimation(selectedVehicle)
          }
        this.toasterService.success(res.type, res.data.message);
      },
      error: (error) => {
        this.toasterService.danger(error.error.message);
      },
    });
  }

  setEstimation(event) {
    this.bookingTypes.map(el => {
      if(el.value == 'rideLater'){
        el.disabled = event.scheduleLater
      }
    })
    const fareData = event.pricing;
    this.fareDetails = {
      fareType_est: fareData.fareType ? fareData.fareType : "N/A",
      dist_est: fareData.distanceKM ? fareData.distanceKM : 0,
      currency: event.currency !== undefined ? event.currency : this.defaultCur,
      distfare_est: this.amountToBeFloater(fareData.distanceFare),
      base_est: this.amountToBeFloater(fareData.baseFare),
      booking_est: this.amountToBeFloater(fareData.bookingFare),
      waitingRate: event.waitingRate ? event.waitingRate : 0,
      waitingTime: event.waitingTime ? event.waitingTime : 0,
      waitingCharge_est: this.amountToBeFloater(fareData.waitingFare),
      timeRate: this.amountToBeFloater(event.timeRate),
      time: event.time ? event.time : 0,
      timefare_est: this.amountToBeFloater(fareData.timeFare),
      minFareAdded_est: this.amountToBeFloater(fareData.minimumFare),
      tax_est: this.amountToBeFloater(fareData.taxFare),
      surgeReason: event.surgeReason ? event.surgeReason : "N/A",
      surgeAmt_est: this.amountToBeFloater(fareData.additionalFare),
      discountName: event.discountName ? event.discountName : "N/A",
      discountPercentage: event.discountPercentage
        ? event.discountPercentage
        : 0,
      detect_est: this.amountToBeFloater(fareData.discountFare),
      cost_est: fareData.actualFare
        ? this.amountToBeFloater(fareData.actualFare)
        : 0.0,
      tips_est: fareData.tips ? this.amountToBeFloater(fareData.tips) : 0.0,
      roundOff_est: this.amountToBeFloater(fareData.roundOff),
      actualcost_est: this.amountToBeFloater(fareData.totalFare),
    };
  }

  amountToBeFloater(num) {
    if (num) {
      return parseFloat(num).toFixed(2);
    } else return "0.00";
  }

  FarereSet() {
    // this.initializeDispatchForm();
    this.selectVehicles = null;
    this.fareDetailsList();
    this.clearSpecificFormControls(); // Clear specific values
  }

  clearSpecificFormControls() {
    this.dispatchForm.patchValue({
      vehicleId: null,
      bookingType: 'rideNow',
      assignType: "",
      tripDate: '',
      tripTime: ''
    });
  }

  bookTrip() {
    const payload = {
      id: this.dispatchForm.value.customerId,
      vehicleId: this.dispatchForm.value.vehicleId.vehicleId,
      pickupLat: this.pickupLat.toString(),
      pickupLng: this.pickupLang.toString(),
      dropLat: this.dropLat.toString(),
      dropLng: this.dropLang.toString(),
      type: this.dispatchForm.value.types,
      requestFrom: "WEB",
      paymentMode: "",
      time: "",
      utc: "",
      currency: "",
      bookingType: this.dispatchForm.value.bookingType,
      assignType: this.dispatchForm.value.assignType,
      tripDate: this.dispatchForm.value.tripDate,
      tripTime: this.dispatchForm.value.tripTime
    };
    this.apiservice
      .CommonPostApi(payload, "services/request/create")
      .subscribe({
        next: (res) => {
          this.TripNo =  res.data.referenceNo
          this.requestId = res.data.requestId
          this.toasterService.success(res.type, res.data.message);
          this.TripInvoiceDialogClose = this.dialogService.open(this.TripInvoiceDialog, {
            autoFocus: false,
            dialogClass: 'nb-dialog-lg',
            closeOnBackdropClick:
              featuresSettings.Nb_dialogbox_close_while_click_outside,
          });
        },
        error: (error) => {
          this.toasterService.danger(error.error.message);
        },
      });
  }
  onBookingTypeChange(event: any) {
    this.isRiderBookingType = event === 'rideLater';
    if (!this.isRiderBookingType) {
      this.dispatchForm.patchValue({ tripDate: '', tripTime: '' });
      // const tripDateControl = this.dispatchForm.get('tripDate');
      // const tripTimeControl = this.dispatchForm.get('tripTime');
  
    }
  }
  
  dateWithinNext7DaysValidator(control: FormControl) {
    if (!control.value) return null;
  
    const selectedDate = new Date(control.value);
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 7);
  
    if (selectedDate >= today && selectedDate <= maxDate) {
      return null;
    } else {
      return { dateOutOfRange: true };
    }
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    return [year, month, day].join('-');
  }

  updateAvailableTimes(date: string): void {
    const selectedDate = new Date(date);
    const currentTime = new Date();

    if (this.formatDate(selectedDate) === this.formatDate(currentTime)) {
      const currentHours = currentTime.getHours();
      const currentMinutes = currentTime.getMinutes();
      this.availableTimes = this.generateTimes(currentHours, currentMinutes);
    } else {
      this.availableTimes = this.generateTimes(0, 0);
    }
  }

  generateTimes(startHour: number, startMinute: number): string[] {
    const times = [];
    let hour = startHour;
    let minute = startMinute;
  
    // Round up to the next 5-minute interval
    minute = Math.ceil(minute / 5) * 5;
    if (minute === 60) {
      minute = 0;
      hour += 1;
    }
  
    while (hour < 24) {
      while (minute < 60) {
        const time = `${this.padNumber(hour)}:${this.padNumber(minute)} ${hour < 12 ? 'AM' : 'PM'}`;
        times.push(time);
        minute += 5; // Step of 5 minutes
      }
      minute = 0;
      hour += 1;
    }
    return times;
  }

  padNumber(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
  goBackBtn() {
    this.location.back();
  }
  getTripInvoice(){
    // this.TripInvoiceDialogClose.close();
    // this.router.navigate([
    //   "company/trips/invoice-details",
    //   { id: this.requestId, newTab: true },
    // ]);
    const url = this.router.serializeUrl(
      this.router.createUrlTree(["company/trips/invoice-details", { id: this.requestId, newTab: true }])
    );
    window.open(url, '_blank');
    // this.pageReSet()
  }
  pageReSet(){
        this.initializeDispatchForm();
        this.selectVehicles = null;
        this.fareDetailsList();
        this.clearSpecificFormControls(); // Clear specific values
  }
}
