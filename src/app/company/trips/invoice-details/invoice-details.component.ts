import { DatePipe, Location } from "@angular/common";
import { Component, ElementRef, NgZone, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NbDialogService, NbMenuService, NbToastrService } from "@nebular/theme";
import { TranslateService } from "@ngx-translate/core";
import { Address } from "ngx-google-places-autocomplete/objects/address";
import { AppSettings, environment, featuresSettings } from "../../../../environments/environment";
import { tripDetails } from "../../../@theme/interface/interface";
import { CompanyDataService } from "../../company-data.service";
import { CompanyapiService } from "../../companyapi.service";
// import { tripDetails } from "../../../@theme/interface/interface";


@Component({
  selector: "ngx-invoice-details",
  templateUrl: "./invoice-details.component.html",
  styleUrls: ["./invoice-details.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class InvoiceDetailsComponent implements OnInit {

  baseUrl = environment.BASEURL;
  @ViewChild("EstimateDialog") EstimateDialog: TemplateRef<any>;
  @ViewChild("InvoiceDialog") InvoiceDialog: TemplateRef<any>;
  @ViewChild("ArrivelDialog") ArrivelDialog: TemplateRef<any>;
  @ViewChild("StartTripDialog") StartTripDialog: TemplateRef<any>;
  @ViewChild("EndTripDialog") EndTripDialog: TemplateRef<any>;
  @ViewChild("cancelTripDialog") cancelTripDialog: TemplateRef<any>;

  invoiceDialogClose: import("@nebular/theme").NbDialogRef<any>;
  estimateDialogClose: import("@nebular/theme").NbDialogRef<any>;
  ArrivelDialogClose:  import("@nebular/theme").NbDialogRef<any>;
  StartTripDialogClose: import("@nebular/theme").NbDialogRef<any>;
  EndTripDialogClose:  import("@nebular/theme").NbDialogRef<any>;
  cancelTripDialogClose: import("@nebular/theme").NbDialogRef<any>;
  EndTripForm: FormGroup;
  StartTripForm: FormGroup;
  ArrivedForm: FormGroup;
  CancelTripForm: FormGroup;
  pickupLat: any;
  pickupLang: any;
  dropLat: any;
  dropLang: any;
  currentPage: string | number;
  pageNum = 1;
  tripdetailsId: any;
  showDetails: boolean = false;
  defaultUnit = featuresSettings.distanceUnit;
  defaultCur = AppSettings.defaultcur;
  tripItemsObservable: any;
  tripDetails: tripDetails;
  minDateTime: Date;
  items = [
    {
      icon: "close-outline",
      title: this.translate.instant("INVOICE.CANCEL_TRIP"),
    },
    { icon: "car-outline", title: this.translate.instant("INVOICE.ARRIVED") },
    {
      icon: "log-in-outline",
      title: this.translate.instant("INVOICE.START_TRIP"),
    },
    {
      icon: "log-out-outline",
      title: this.translate.instant("INVOICE.END_TRIP"),
    },
    {
      icon: "refresh-outline",
      title: this.translate.instant("INVOICE.RETRY_BOOKING"),
    },
  ];

  showFareFor: string = 'DAILY' || 'daily';
  tripDateTime: any;
  fareDetails: any =  {};
  driverDetails: any = [];
  requestId: any;
  tripActionObject: { requestId: any; status: string; latitude: any; longitude: any; requestTime: string; };
  canceledBy: string;
  cancelReason: any;
  comment: any;
  commentBy: string;
  commentBypartner: string;
  commentBycustomer: string;
  partnercomment: any;
  customercomment: string;
  customerrating: number;
  partnerrating: number;

  constructor(
    private apiservice: CompanyapiService,
    private toasterService: NbToastrService,
    private ActivatedRoute: ActivatedRoute,
    private menuService: NbMenuService,
    public translate: TranslateService,
    private datePipe: DatePipe,
    private location: Location,
    private dialogService: NbDialogService,
    private dataService: CompanyDataService,
    private router: Router,
    private ngZone: NgZone,
  ) {
    this.minDateTime = new Date();
   }
   showBackButton: boolean = true;
  ngOnInit(): void {
    this.tripdetailsId = this.ActivatedRoute.snapshot.paramMap.get("id");
    this.requestDriver(this.tripdetailsId);
    this.subscribeToMenuItem();
    this.initialArrivedForm();
    this.initialEndTripForm()
    this.initialStartTripForm();
    this.initialCanceltrip();
    this.ActivatedRoute.params.subscribe(params => {
      if (params['newTab']) {
        this.showBackButton = false;
      }
    });
  }
  subscribeToMenuItem() {
    this.tripItemsObservable = this.menuService
      .onItemClick()
      .subscribe((event) => {
        if (
          event.item.title === this.translate.instant("INVOICE.CANCEL_TRIP")
        ) {
          this.cancelTripDialogClose = this.dialogService.open(this.cancelTripDialog, {
            autoFocus: false,
            dialogClass: 'nb-dialog',
            closeOnBackdropClick:
              featuresSettings.Nb_dialogbox_close_while_click_outside,
          });
        }
        if (event.item.title === this.translate.instant("INVOICE.ARRIVED")) {
          this.ArrivelDialogClose = this.dialogService.open(this.ArrivelDialog, {
            autoFocus: false,
            dialogClass: 'nb-dialog',
            closeOnBackdropClick:
              featuresSettings.Nb_dialogbox_close_while_click_outside,
          });
        }
        if (event.item.title === this.translate.instant("INVOICE.START_TRIP")) {
          this.PatchStartTripForm();
          this.StartTripDialogClose = this.dialogService.open(this.StartTripDialog, {
            autoFocus: false,
            dialogClass: 'nb-dialog',
            closeOnBackdropClick:
              featuresSettings.Nb_dialogbox_close_while_click_outside,
          });
        }
        if (event.item.title === this.translate.instant("INVOICE.END_TRIP")) {
          this.patchEndTripForm();
          this.EndTripDialogClose = this.dialogService.open(this.EndTripDialog, {
            autoFocus: false,
            dialogClass: 'nb-dialog-size',
            closeOnBackdropClick:
              featuresSettings.Nb_dialogbox_close_while_click_outside,
          });
        }
        if (
          event.item.title === this.translate.instant("INVOICE.RETRY_BOOKING")
        ) {
          this.retryBooking()
        }
      });
  }
  ngOnDestroy() {
    if (this.tripItemsObservable) {
      this.tripItemsObservable.unsubscribe();
    }
  }
  requestDriver(id): void {
    this.apiservice.CommonGetApi("services/request?id=" + id).subscribe({
      next: (msg) => {
        // tripDetails
        const Gettriphistory: tripDetails = msg.data.requestData;
        this.dataService.setNewRowInfo(Gettriphistory);
        this.tripDetails = Gettriphistory
        this.defaultUnit = this.tripDetails.distanceMetric === 'KILOMETER' ? 'KM' :
                  this.tripDetails.distanceMetric === 'METER' ? 'M' :
                  this.tripDetails.distanceMetric === 'MILE' ? 'Miles':featuresSettings.distanceUnit;
        this.requestId = this.tripDetails._id.toString()
        let formattedDate = this.datePipe.transform(Gettriphistory.scheduleOn, 'dd MMM yyyy, h:mm a');
        this.tripDateTime = formattedDate
        this.driverDetails = Gettriphistory.partnerList;
        this.getTripDetail(Gettriphistory);
        this.checkForCancellation(Gettriphistory)
        this.checkForFeedback(Gettriphistory)
        this.showDetails = true;
      },
      error: (error) => {
        this.toasterService.danger(error.error.message);
      },
    });
  }
  tripActionObjectFunction() {
    this.tripActionObject = {
      requestId: this.requestId,
      status:
        this.tripDetails.status === "Accepted"
          ? "1"
          : this.tripDetails.status === "Arrived"
            ? "2"
            : this.tripDetails.status === "Progress"
              ? "3"
              : "0",
        latitude: '',
        longitude: '',
        requestTime:''    
      // latitude: this.tripDetails.estimation.endcoords ? this.tripDetails.estimation.endcoords[1].toString() : '',
      // longitude: this.tripDetails.estimation.endcoords ? this.tripDetails.estimation.endcoords[0].toString() : '',
      // requestTime: this.tripDetails.partner.startTime ? this.tripDetails.partner.startTime.toString() : '',
    };
  }
  getTripDetail(data: any): void {
    if (data.module === "DAILY" || data.module === "daily") {
      this.setFareValues(data.status, data);
      this.tripActionObjectFunction();
    } else {
      this.goBack();
    }
  }
  setFareValues(status, data) {
    if (this.showFareFor === "DAILY" || this.showFareFor === "daily") {
      if (status === "Finished") {
        this.fareDetails = {
          estTime: data.invoice.estTime? data.invoice.estTime: '0',
          currency:data.currency ? data.currency : this.defaultCur,
          distance: data.invoice.distance ? data.invoice.distance : 0,
          actualcost: this.amountToBeFloater(data.invoice.totalFare),
          fareType: data.invoice.fareType ? data.invoice.fareType : "N/A",
          distfare: this.amountToBeFloater(data.invoice.fareAmt),
          base: this.amountToBeFloater(data.invoice.baseFare),
          booking: this.amountToBeFloater(data.invoice.bookingFare),
          waitingRate: data.waitingRate ? data.waitingRate : 0,
          waitingTime: data.waitingTime ? data.waitingTime : 0,
          waitingCharge: this.amountToBeFloater(data.invoice.waitingFare),
          timeRate: this.amountToBeFloater(data.timeRate),
          time: data.time ? data.time : 0,
          timefare: this.amountToBeFloater(data.invoice.timeFare),
          minFareAdded: this.amountToBeFloater(data.invoice.minimumFare),
          tax: this.amountToBeFloater(data.invoice.taxFare),
          surgeReason: data.surgeReason ? data.surgeReason : "N/A",
          surgeAmt: this.amountToBeFloater(data.invoice.additionalFare),
          discountName: data.discountName ? data.discountName : "N/A",
          discountPercentage: data.discountPercentage
            ? data.discountPercentage
            : 0,
          detect: this.amountToBeFloater(data.invoice.discountFare),
          cost: data.invoice.actualFare
          ? this.amountToBeFloater(data.invoice.actualFare)
          : 0.0,
          tips: data.invoice.tips
          ? this.amountToBeFloater(data.invoice.tips)
          : 0.0,
          roundOff: this.amountToBeFloater(data.invoice.roundOff),

          //estimation
          est_Time: data.estimation.estTime? data.estimation.estTime: '0',
          dist_est: data.estimation.distance ? data.estimation.distance : 0,
          distfare_est: this.amountToBeFloater(data.estimation.fareAmt),
          base_est: this.amountToBeFloater(data.estimation.baseFare),
          booking_est: this.amountToBeFloater(data.estimation.bookingFare),
          waitingCharge_est: this.amountToBeFloater(
            data.estimation.waitingFare
          ),
          timefare_est: this.amountToBeFloater(data.estimation.timeFare),
          minFareAdded_est: this.amountToBeFloater(data.estimation.minimumFare),
          tax_est: this.amountToBeFloater(data.estimation.taxFare),
          surgeAmt_est: this.amountToBeFloater(data.estimation.additionalFare),
          detect_est: this.amountToBeFloater(data.estimation.discountFare),
          roundOff_est: this.amountToBeFloater(data.estimation.roundOff),
          actualcost_est: this.amountToBeFloater(data.estimation.totalFare),
          cost_est: data.estimation.actualFare
            ? this.amountToBeFloater(data.estimation.actualFare)
            : 0.0,
          tips_est: data.estimation.tips
            ? this.amountToBeFloater(data.estimation.tips)
            : 0.0,
          fareType_est: data.estimation.fareType
            ? data.estimation.fareType
            : "N/A",
        }
      } else {
        this.fareDetails = {
          estTime: data.estimation.estTime? data.estimation.estTime: '0',
          currency:data.currency !== undefined ? data.currency : this.defaultCur,
          distance: data.estimation.distance ? data.estimation.distance : 0,
          actualcost: this.amountToBeFloater(data.estimation.totalFare),
          fareType: data.estimation.fareType ? data.estimation.fareType : "N/A",
          distfare: this.amountToBeFloater(data.estimation.fareAmt),
          base: this.amountToBeFloater(data.estimation.baseFare),
          booking: this.amountToBeFloater(data.estimation.bookingFare),
          waitingRate: data.waitingRate ? data.waitingRate : 0,
          waitingTime: data.waitingTime ? data.waitingTime : 0,
          waitingCharge: this.amountToBeFloater(data.estimation.waitingFare),
          timeRate: this.amountToBeFloater(data.timeRate),
          time: data.time ? data.time : 0,
          timefare: this.amountToBeFloater(data.estimation.timeFare),
          minFareAdded: this.amountToBeFloater(data.estimation.minimumFare),
          tax: this.amountToBeFloater(data.estimation.taxFare),
          surgeReason: data.surgeReason ? data.surgeReason : "N/A",
          surgeAmt: this.amountToBeFloater(data.estimation.additionalFare),
          discountName: data.discountName ? data.discountName : "N/A",
          discountPercentage: data.discountPercentage
            ? data.discountPercentage
            : 0,
          detect: this.amountToBeFloater(data.estimation.discountFare),
          cost: data.estimation.actualFare
          ? this.amountToBeFloater(data.estimation.actualFare)
          : 0.0,
          tips: data.estimation.tips
          ? this.amountToBeFloater(data.estimation.tips)
          : 0.0,
          roundOff: this.amountToBeFloater(data.estimation.roundOff),

          //estimation
          est_Time: data.estimation.estTime? data.estimation.estTime: '0',
          dist_est: data.estimation.distance ? data.estimation.distance : 0,
          distfare_est: this.amountToBeFloater(data.estimation.fareAmt),
          base_est: this.amountToBeFloater(data.estimation.baseFare),
          booking_est: this.amountToBeFloater(data.estimation.bookingFare),
          waitingCharge_est: this.amountToBeFloater(
            data.estimation.waitingFare
          ),
          timefare_est: this.amountToBeFloater(data.estimation.timeFare),
          minFareAdded_est: this.amountToBeFloater(data.estimation.minimumFare),
          tax_est: this.amountToBeFloater(data.estimation.taxFare),
          surgeAmt_est: this.amountToBeFloater(data.estimation.additionalFare),
          detect_est: this.amountToBeFloater(data.estimation.discountFare),
          roundOff_est: this.amountToBeFloater(data.estimation.roundOff),
          actualcost_est: this.amountToBeFloater(data.estimation.totalFare),
          cost_est: data.estimation.actualFare
            ? this.amountToBeFloater(data.estimation.actualFare)
            : 0.0,
          tips_est: data.estimation.tips
            ? this.amountToBeFloater(data.estimation.tips)
            : 0.0,
          fareType_est: data.estimation.fareType
            ? data.estimation.fareType
            : "N/A",
        }
      }
    }
    else {
      this.goBack();
    }
  }
  tripActions(status) {
    if (status == "Accepted") {
      this.items = [
        {
          icon: "close-outline",
          title: this.translate.instant("INVOICE.CANCEL_TRIP"),
        },
        {
          icon: "car-outline",
          title: this.translate.instant("INVOICE.ARRIVED"),
        },
      ];
    } else if (status == "Arrived") {
      this.items = [
        {
          icon: "close-outline",
          title: this.translate.instant("INVOICE.CANCEL_TRIP"),
        },
        {
          icon: "log-in-outline",
          title: this.translate.instant("INVOICE.START_TRIP"),
        },
      ];
    } else if (status == "Progress") {
      this.items = [
        // {
        //   icon: "close-outline",
        //   title: this.translate.instant("INVOICE.CANCEL_TRIP"),
        // },
        {
          icon: "log-out-outline",
          title: this.translate.instant("INVOICE.END_TRIP"),
        },
      ];
    } else if (status == "Noresponse" || "Cancelled") {
      this.items = [
        {
          icon: "refresh-outline",
          title: this.translate.instant("INVOICE.RETRY_BOOKING"),
        },
      ];
    }
  }
  retryBooking() {
    this.currentPage = this.ActivatedRoute.snapshot.paramMap.get("page") || this.pageNum;
    const id = this.tripdetailsId;
    this.router.navigate(["/company/dispatch/manual-taxi-dispatch", 
    { id: id, page: this.currentPage }]);
  }
  amountToBeFloater(num) {
    if (num) {
      return parseFloat(num).toFixed(2);
    } else {
      return "0.00";
    }
  }
  goBack() {
    this.location.back();
  }
  viewestimate(){
    // this.openDeleteDialog(this.EstimateDialog);
    this.estimateDialogClose = this.dialogService.open(this.EstimateDialog, {
      autoFocus: false,
      dialogClass: 'nb-dialog-lg',
      closeOnBackdropClick:
        featuresSettings.Nb_dialogbox_close_while_click_outside,
    });
  }
  viewInvoice(){
    this.invoiceDialogClose = this.dialogService.open(this.InvoiceDialog, {
      autoFocus: false,
      dialogClass: 'nb-dialog-lg',
      closeOnBackdropClick:
        featuresSettings.Nb_dialogbox_close_while_click_outside,
    });
  }
  initialCanceltrip(){
    this.CancelTripForm = new FormGroup({
      reason: new FormControl(""),
    })
  }
  initialArrivedForm(){
    this.ArrivedForm = new FormGroup({
      ArrivelLocation: new FormControl("", Validators.required),
      ArrivelTime: new FormControl("", Validators.required),
    })
  }
  initialStartTripForm(){
    this.StartTripForm = new FormGroup({
      pickupLocation: new FormControl("", Validators.required),
      startTime: new FormControl("", Validators.required),
    })
  }
  PatchStartTripForm(){
    this.dataService
    .getNewRowInfo()
    .subscribe((data)=>{
      const rowData: any = data;
      if (JSON.stringify(rowData) !== "{}") {
        this.pickupLat = rowData.estimation.startcoords[1],
        this.pickupLang = rowData.estimation.startcoords[0],
        this.StartTripForm.patchValue({
          pickupLocation: rowData.estimation.start,
          startTime: rowData.partner.startTime,
        })
      }
    })
  }
  initialEndTripForm(){
    this.EndTripForm = new FormGroup({
      pickupLocation: new FormControl({value:"",disabled: true}, Validators.required),
      dropLocation: new FormControl('', Validators.required),
      startTime: new FormControl({value:"",disabled: true}, Validators.required),
      endTime: new FormControl("", Validators.required),
      distance: new FormControl(''),
      duration: new FormControl(''),
      waitingSecond: new FormControl(''),
    })
  }
  patchEndTripForm(){
    this.dataService
    .getNewRowInfo()
    .subscribe((data)=>{
      const rowData: any = data;
      if (JSON.stringify(rowData) !== "{}") {
        this.pickupLat = rowData.invoice.startcoords[1],
        this.pickupLang = rowData.invoice.startcoords[0],
        this.dropLat = rowData.estimation.endcoords[1],
        this.dropLang = rowData.estimation.endcoords[0],
        this.EndTripForm.patchValue({
          pickupLocation: rowData.estimation.start,
          dropLocation: rowData.estimation.end,
          startTime: rowData.partner.startTime,
          endTime: rowData.partner.endTime,
          distance: rowData.estimation.distance,
          duration: '',
          waitingSecond: '',
        })
      }
    })
  }
  get ArrivelLocation() {
    return this.EndTripForm.get("ArrivelLocation");
  }
  get pickupLocation() {
    return this.EndTripForm.get("pickupLocation");
  }
  get dropLocation() {
    return this.EndTripForm.get("dropLocation");
  }
  get reason(){
    return this.CancelTripForm.get('reason')
  }
  OnhandleStartArrivelLocationChange(address: Address){
    this.ngZone.run(() => {
      if (address.geometry) {
        this.tripActionObject.latitude = address.geometry.location.lat().toString();
        this.tripActionObject.longitude = address.geometry.location.lng().toString();
      }
    });
  }
  handleStartPickupLocationChange(address: Address) {
    this.ngZone.run(() => {
      if (address.geometry) {
        this.pickupLat = address.geometry.location.lat();
        this.pickupLang = address.geometry.location.lng();
        this.StartTripForm.patchValue({ pickupLocation: address.formatted_address });
        this.EndTripForm.patchValue({ pickupLocation: address.formatted_address });
      }
    });
  }
  handlePickupLocationChange(address: Address) {
    this.ngZone.run(() => {
      if (address.geometry) {
        this.pickupLat = address.geometry.location.lat();
        this.pickupLang = address.geometry.location.lng();
        this.EndTripForm.patchValue({ pickupLocation: address.formatted_address });
      }
    });
  }
  handleDropLocationChange(address: Address) {
    this.ngZone.run(() => {
      if (address.geometry) {
        this.dropLat = address.geometry.location.lat();
        this.dropLang = address.geometry.location.lng();
        this.EndTripForm.patchValue({ dropLocation: address.formatted_address });
      }
    });
  }
  startATrip(){
    this.tripActionObject.latitude= this.pickupLat?this.pickupLat.toString():'';
    this.tripActionObject.longitude = this.pickupLang?this.pickupLang.toString():'';
    const startTime = this.StartTripForm.value.startTime;
    this.tripActionObject.requestTime = startTime ? this.convertToISO(startTime.toString()) : '';
    this.apiservice
      .CommonPutApi("services/request/update", this.tripActionObject)
      .subscribe({
      next: (res) => {
        this.toasterService.success(res.type, res.message);
        this.tripDetails.status = res.data.status;
        this.tripDetails.invoice.start =  this.StartTripForm.value.pickupLocation
        this.tripDetails.invoice.startcoords = [this.tripActionObject.longitude,this.tripActionObject.latitude]
        this.tripDetails.partner.startTime = this.tripActionObject.requestTime
        this.StartTripDialogClose.close()
        },
        error: (error) => {
          this.toasterService.danger(error.error.message);
        },
      });
  }
  convertToISO(dateString: string): string {
    // Parse the date string to create a Date object
    const date = new Date(dateString);
    
    // Convert the Date object to ISO 8601 format with milliseconds
    const isoString = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();

    return isoString;
  }
  endATrip(){
    const startTime = this.EndTripForm.value.startTime;
    const requestStartTime = startTime ? this.convertToISO(startTime.toString()) : '';
    const endTime = this.EndTripForm.value.endTime;
    const requestEndTime = endTime ? this.convertToISO(endTime.toString()) : '';
    const payload = {
      requestId: this.requestId,
      status:
        this.tripDetails.status === "Accepted"
          ? "1"
          : this.tripDetails.status === "Arrived"
            ? "2"
            : this.tripDetails.status === "Progress"
              ? "3"
              : "0",
      pickupLat: this.pickupLat?this.pickupLat.toString():'',
      pickupLang: this.pickupLang?this.pickupLang.toString():'',
      latitude: this.dropLat?this.dropLat.toString():'',
      longitude: this.dropLang? this.dropLang.toString():'',
      requestTime: requestStartTime,
      requestEndTime: requestEndTime,
      distance: this.EndTripForm.value.distance?this.EndTripForm.value.distance:''
    }
    this.apiservice
      .CommonPutApi("services/request/update", payload)
      .subscribe({
      next: (res) => {
        this.toasterService.success(res.type, res.message);
        this.tripDetails.status = res.data.requestData.status;
        // this.tripDetails.partner.endTime = requestEndTime
        // this.tripDetails.estimation.end = this.EndTripForm.value.dropLocation
        // this.tripDetails.estimation.endcoords = [this.dropLang,this.dropLat]
        // this.tripDetails.invoice.end = this.EndTripForm.value.dropLocation
        // this.tripDetails.invoice.endcoords = [this.dropLang,this.dropLat]
        this.requestDriver(this.tripdetailsId)
   
        this.EndTripDialogClose.close();
        },
        error: (error) => {
          this.toasterService.danger(error.error.message);
        },
      });
  }
  handleImageError(event: any) {
    event.target.src = 'assets/images/map.svg';
  }
  arrivedlocation(){
    const ArrivelTime = this.ArrivedForm.value.ArrivelTime;
    this.tripActionObject.requestTime = ArrivelTime ? this.convertToISO(ArrivelTime.toString()) : '';
    this.apiservice
    .CommonPutApi("services/request/update", this.tripActionObject)
    .subscribe({
      next: (res) => {
        this.toasterService.success(res.type, res.message);
        this.tripDetails.status = res.data.status;
        this.ArrivelDialogClose.close();
        this.tripActionObjectFunction();
      },
      error: (error) => {
        this.toasterService.danger(error.error.message);
      },
    });
  }
  canceledTrip(){
    const data = {
      reason: this.CancelTripForm.value.reason?this.CancelTripForm.value.reason:'',
      tripno: this.tripDetails.referenceNo,
    };
    this.apiservice
      .CommonPutApi("services/request/partnerCancel", data)
      .subscribe({
        next: (res) => {
          this.toasterService.success(res.type, res.message);
          this.tripDetails.status = res.data.status;
          this.cancelTripDialogClose.close()
        },
        error: (error) => {
          this.toasterService.danger(error.error.message);
        },
      });
  }
  checkForCancellation(tripDetails: tripDetails) {
    if (tripDetails.customer.cancelReason) {
      this.canceledBy = 'Customer';
      this.cancelReason = tripDetails.customer.cancelReason;
    } else if (tripDetails.partner.cancelReason) {
      this.canceledBy = 'Partner';
      this.cancelReason = tripDetails.partner.cancelReason;
    } 
  }
  checkForFeedback(tripDetails: tripDetails){
    console.log(tripDetails.partner.rating)
    if (tripDetails.customer.rating > 0) {
      this.commentBycustomer = 'Customer';
      this.customercomment = tripDetails.customer.comment?tripDetails.customer.comment:'---';
      this.customerrating = tripDetails.customer.rating
    }
    if (tripDetails.partner.rating > 0) {
      this.commentBypartner = 'Partner';
      this.partnercomment = tripDetails.partner.comment?tripDetails.partner.comment:'---';
      this.partnerrating = tripDetails.partner.rating
    } 
  }
}