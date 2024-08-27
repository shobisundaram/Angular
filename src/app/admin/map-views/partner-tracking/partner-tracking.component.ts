import {
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
  TemplateRef,
} from "@angular/core";
import { Router } from "@angular/router";
import {
  AppSettings,
  environment,
  featuresSettings,
} from "../../../../environments/environment";
import { ApiService } from "../../api.service";
import { DataService } from "../../data.service";
import { GoogleMapsLoaderService } from "../../google-maps-loader.service";
import { FormControl, FormGroup } from "@angular/forms";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import MarkerClusterer from "@googlemaps/markerclustererplus";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "ngx-partner-tracking",
  templateUrl: "./partner-tracking.component.html",
  styleUrls: ["./partner-tracking.component.scss"],
})
export class PartnerTrackingComponent implements OnInit, OnDestroy {
  lat = environment.defaultCountryLat;
  lng = environment.defaultCountryLan;
  zoom = AppSettings.MAP_ZOOM;
  mapFilterForm: FormGroup;
  serviceAvailableCities: any;
  isClearButtonDisabled: boolean = true;
  servicetypes: any;
  baseurl = environment.BASEURL;
  partnerData = [];

  @ViewChild("search") public searchElementRef: ElementRef;
  items = [
    { title: this.translate.instant("MAPS.ALL") },
    { title: this.translate.instant("MAPS.FREE_ONLINE") },
    { title: this.translate.instant("MAPS.ACCEPTED") },
    { title: this.translate.instant("MAPS.ARRIVED") },
    { title: this.translate.instant("MAPS.INTRIP") },
  ];

  constructor(
    private router: Router,
    private dataService: DataService,
    private apiservice: ApiService,
    private mapsLoader: GoogleMapsLoaderService,
    private toasterService: NbToastrService,
    private readonly ngZone: NgZone,
    private translate: TranslateService,
    private dialogService: NbDialogService
  ) {
    this.apiservice.CommonGetApi("creteria/serviceArea/list").subscribe({
      next: (res) => {
        this.serviceAvailableCities = res.data.serviceArea;
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
    this.initializeMapFilterForm();
  }
  dialogObservable: any;

  ngAfterViewInit() {
    this.initAutocomplete();
  }

  initAutocomplete(): void {
    this.ngZone.runOutsideAngular(() => {
      const autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement
      );

      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          console.log("PLACE", place);
          if (place && place.geometry && place.geometry.location) {
            this.mapFilterForm.patchValue({
              defaultLocation: place.formatted_address,
            });
            this.initializeMap();
          }
        });
      });
    });
  }

  ngOnInit(): void {
    this.apiservice
      .CommonGetApi("common/admin/partnerTracking?limit=200&page=1")
      .subscribe({
        next: (res) => {
          this.partnerData = res.data.partners;
          this.loadMap();
        },
        error: (error) => {
          this.toasterService.danger(error.error.message);
        },
      });
  }

  ngOnDestroy(): void {
    // this.dialogObservable.unsubscribe();
  }

  loadMap() {
    this.mapsLoader
      .load()
      .then((res) => {
        this.initializeMap();
      })
      .catch((err) => {
        console.error("Error loading Google Maps API:", err);
      });
  }

  initializeMap(): void {
    const geocoder = new google.maps.Geocoder();
    const placeName = this.mapFilterForm.value.defaultLocation;

    geocoder.geocode({ address: placeName }, (results: any, status: string) => {
      if (status === "OK") {
        const centerCoords = results[0].geometry.location;

        const map = new google.maps.Map(document.getElementById("trackerMap"), {
          center: centerCoords,
          zoom: AppSettings.MAP_ZOOM,
          mapId: "243c43004ef20f68",
          streetViewControl: false
        });

        const markers = [];
        let openInfoWindow: google.maps.InfoWindow | null = null;

        if (this.partnerData.length > 0) {
          for (let data of this.partnerData) {

            const foundObject = this.servicetypes.find(
              (obj) => obj._id === data.curService
            );
            const iconURL = foundObject
              ? this.baseurl +
              (foundObject.topViewImage
                ? foundObject.topViewImage
                : foundObject.image)
              : "assets/images/Car.svg";

            const marker = new google.maps.Marker({
              position: {
                lat: data.location.coordinates[1],
                lng: data.location.coordinates[0],
              },
              map: map,
              title: "Marker Title",
              icon: {
                url: iconURL,
                scaledSize: new google.maps.Size(50, 50),
              },
            });

            const infoWindowContent = `
            <div style="padding: 10px">
            <div class="gm-style-iw-chr">
            <div class="gm-style-iw-ch" id="86155F85-903C-4CE9-B713-FD0C730D36F2">
            <strong>Partner Details </strong>
            </div>
              <button id="customCloseButton" draggable="false" aria-label="Close" title="Close" type="button" class="gm-ui-hover-effect" style="background: none; display: block; border: 0px; margin: 0px; padding: 0px; text-transform: none; appearance: none; position: relative; cursor: pointer; user-select: none; width: 35px; height: 35px;">
                  <span style="mask-image: url(&quot;data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22M19%206.41L17.59%205%2012%2010.59%206.41%205%205%206.41%2010.59%2012%205%2017.59%206.41%2019%2012%2013.41%2017.59%2019%2019%2017.59%2013.41%2012z%22/%3E%3Cpath%20d%3D%22M0%200h24v24H0z%22%20fill%3D%22none%22/%3E%3C/svg%3E&quot;); pointer-events: none; display: block; width: 24px; height: 24px; margin: 6px;">
                  </span>
              </button>
            </div>
            <hr>
            <label><strong>${data.uniCode}, ${data.fname} </strong></label><br />
            <label>${data.phone}.</label>
            </div>
            <style>
            .gm-style-iw-c {
              background-color: #fff;
              color: #333;
              font-size: 16px;
              border-radius: 50%;
              border: 2px solid #ccc;
              width: 200px;
              // height: 120px;
              text-align: left;
            }
            .gm-style .gm-style-iw-c{
              padding: 0!important
            }
            .gm-style-iw-d{
              overflow: auto !important
            }
            button.gm-ui-hover-effect {
              background-color: #9a9a9aa3 !important;
              border-radius: 50% !important;
          }
                  /* New style to hide the close button */
            .gm-style-iw > div:nth-child(1) {
              display: none;
            }
            .gm-style-iw-ch{
              padding-top: 0 !important
            }
            .gm-style-iw-chr{
              align-items: center;
            }
            </style>
          `;

            const infoWindow = new google.maps.InfoWindow({
              content: infoWindowContent,
            });

            marker.addListener("click", () => {
              if (openInfoWindow) {
                openInfoWindow.close();
              }
              infoWindow.open(map, marker);
              openInfoWindow = infoWindow;
              google.maps.event.addListener(infoWindow, 'domready', () => {
                const customCloseButton = document.getElementById('customCloseButton');
                customCloseButton?.addEventListener('click', () => {
                  infoWindow.close();
                });
              });
            });
            markers.push(marker);
          }
          const markerCluster = new MarkerClusterer(map, markers, {
            imagePath:
              "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
            gridSize: 60,
            maxZoom: 15, // Adjust as needed
          });
        }
      } else {
        console.error(
          "Geocode was not successful for the following reason: " + status
        );
      }
    });
  }

  initializeMapFilterForm(): void {
    this.mapFilterForm = new FormGroup({
      serviceCity: new FormControl(null),
      servicetype: new FormControl(null),
      defaultLocation: new FormControl("Madurai, Tamil Nadu, India"),
      partnerPhone: new FormControl(""),
      curStatus: new FormControl(),
      status: new FormControl(),
    });
    // Subscribe to value changes
    this.mapFilterForm.valueChanges.subscribe(() => {
      this.updateClearButtonState();
    });

    // Initial check for the button state
    this.updateClearButtonState();

  }
  updateClearButtonState(): void {
    const { serviceCity, servicetype, partnerPhone, curStatus, status } = this.mapFilterForm.value;
    this.isClearButtonDisabled = !serviceCity && !servicetype && !partnerPhone && !curStatus && !status;
  }
  filterAPI1(): void {
    const serviceCity = this.mapFilterForm.value.serviceCity;
    const serviceType = this.mapFilterForm.value.servicetype;
    const partnerPhone = this.mapFilterForm.value.partnerPhone;
    const curStatus = this.mapFilterForm.value.curStatus;
    const status = this.mapFilterForm.value.status;

    let queryParams = "common/admin/partnerTracking?limit=200&page=1";

    if (serviceCity) {
      queryParams += "&serviceArea=" + serviceCity;
    }

    if (serviceType) {
      queryParams += "&curService=" + serviceType;
    }

    if (partnerPhone) {
      queryParams += "&search=" + partnerPhone;
    }

    if (curStatus) {
      if (curStatus == "Online") {
        queryParams += "&curStatus=" + "free";
      } else if (curStatus == "In Trip") {
        queryParams += "&curStatus=" + "Progress";
      } else {
        queryParams += "&curStatus=" + curStatus;
      }
    }

    if (status) {
      queryParams += "&search=" + status;
    }

    this.apiservice.CommonGetApi(queryParams).subscribe({
      next: (res) => {
        this.partnerData = res.data.partners;
        this.initializeMap();
      },
      error: (error) => {
        this.toasterService.danger(error.error.message);
      },
    });
  }

  vehicleServiceTypePopup: any;
  openVehiclesDialog(dialog: TemplateRef<any>) {
    this.vehicleServiceTypePopup = this.dialogService.open(dialog, {
      context: "Select Your Vehicles",
      autoFocus: false,
      closeOnBackdropClick:
        featuresSettings.Nb_dialogbox_close_while_click_outside,
    });
  }

  selectedVehicleName: any;
  // onServiceTypeSelect(id, name) {
  //   this.selectedVehicleName = name;
  //   this.mapFilterForm.patchValue({
  //     servicetype: id,
  //   });
  //   this.vehicleServiceTypePopup.close();
  // }
  onServiceTypeSelect(event) {
    console.log(event)
    this.selectedVehicleName = event.name;
    this.mapFilterForm.patchValue({
      servicetype: event._id,
    });
  }

  vehicleStatusPopup: any;
  openStatusDialog(dialog: TemplateRef<any>) {
    this.vehicleStatusPopup = this.dialogService.open(dialog, {
      context: "Select Vehicles Status",
      autoFocus: false,
      closeOnBackdropClick:
        featuresSettings.Nb_dialogbox_close_while_click_outside,
    });
  }

  // onVehicleStatusSelect(name) {
  //   if (name == "All") {
  //     this.mapFilterForm.patchValue({
  //       curStatus: "",
  //     });
  //   } else {
  //     this.mapFilterForm.patchValue({
  //       curStatus: name,
  //     });
  //   }
  //   this.vehicleStatusPopup.close();
  // }
  onVehicleStatusSelect(event){
    console.log(event.title)
    if (event.title == "All") {
      this.mapFilterForm.patchValue({
        curStatus: "",
      });
    } else {
      this.mapFilterForm.patchValue({
        curStatus: event.title,
      });
    }
  }

  routeToPartner(partnerId) {
    if (partnerId) {
      this.apiservice.CommonGetApi("common/partner/" + partnerId).subscribe({
        next: (res) => {
          const result = res.data.Partner[0];
          this.router.navigate([
            "admin/partner/add-edit-partner",
            { id: result._id },
          ]);
          this.dataService.setNewRowInfo(result);
        },
        error: (error) => {
          this.toasterService.danger(error.error.message);
        },
      });
    }
  }
  clear(){
    this.initializeMapFilterForm()
    this.filterAPI1()
  }
}
