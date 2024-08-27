import {
  Component,
  OnInit,
  OnDestroy,
  TemplateRef,
  ViewChild,
  NgZone,
  ElementRef,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { DataService } from "../../../data.service";
import {
  AppSettings,
  environment,
  featuresSettings,
} from "../../../../../environments/environment";
import { ApiService } from "../../../api.service";
import {
  NbDialogService,
  NbMenuService,
  NbToastrService,
} from "@nebular/theme";
import { Location } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";
import { Service_Available_City } from "../../../../@theme/interface/interface";
import { GoogleMapsLoaderService } from "../../../google-maps-loader.service";
declare const google: any;

@Component({
  selector: "ngx-add-service-available-citys",
  templateUrl: "./add-service-available-citys.component.html",
  styleUrls: ["./add-service-available-citys.component.scss"],
})
export class AddServiceAvailableCitysComponent implements OnInit, OnDestroy {
  lat: any = environment.defaultCountryLat;
  lng: any = environment.defaultCountryLan;
  // lat: any;
  // lng: any;
  pointList: any = [];
  drawingManager: any;
  selectedShape: any;
  updateShape: any;
  selectedArea = 0;
  @ViewChild("DeleteDialog") deleteDialog: TemplateRef<any>;
  items = [
    {
      icon: "trash-2",
      title: this.translate.instant(
        "SERVICEAVAILABLECITY.DELETESERVICEAVAILABLECITY"
      ),
    },
  ];
  serviceAvailableCityDeleteDialogClose: import("@nebular/theme").NbDialogRef<any>;
  baseurl = environment.BASEURL;
  serviceAvailableCityForm: FormGroup;
  countrys: any;
  states: any;
  cities: any;
  paths: any = [];
  dataServiceSubscition: any;

  constructor(
    private dataService: DataService,
    private apiservice: ApiService,
    private toasterService: NbToastrService,
    private location: Location,
    public translate: TranslateService,
    private dialogService: NbDialogService,
    private menuService: NbMenuService,
    private ActivatedRoute: ActivatedRoute,
    // private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private el: ElementRef,
    private mapsLoader: GoogleMapsLoaderService
  ) {}
  dialogObservable: any;


  ngOnInit(): void {
    this.initializeserviceAvailableCityForm();
    this.patchserviceAvailableCityForm();
    this.subscribeToMenuItem();
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

  polyOptions: any;
  map: any;
  initializeMap(): void {
    const geocoder = new google.maps.Geocoder();
    const placeName = AppSettings.GOOGLE_MAP_DEFAULT_LOCATION;

    geocoder.geocode({ address: placeName }, (results: any, status: string) => {
      if (status === "OK") {
        const centerCoords = results[0].geometry.location;
        console.log("GEOCODE", results);

        this.map = new google.maps.Map(document.getElementById("trackerMap"), {
          center: centerCoords,
          zoom: AppSettings.MAP_ZOOM,
          // mapId: "243c43004ef20f68",
          streetViewControl: false,
          mapTypeControl: false, 
        });
        this.polyOptions = new google.maps.Polygon({
          // polygonOptions: {
          paths: this.pointList,
          draggable: false,
          editable: true,
          strokeColor: "#3366ff",
          strokeWeight: 3,
          map: this.map,
          // },
        });
        const options = {
          // drawingMode: google.maps.drawing.OverlayType.POLYGON,
          drawingControl: true,
          drawingControlOptions: {
            // position: google.maps.ControlPosition.TOP_CENTER,
            // drawingModes: [google.maps.drawing.OverlayType.POLYGON],
            drawingModes: this.pointList.length === 0 ? ["polygon"] : [],
          },
          polygonOptions: {
            // paths: this.pointList,
            draggable: false,
            editable: true,
            strokeColor: "#3366ff",
            strokeWeight: 3,
            map: this.map,
          },
          drawingMode:
            this.pointList.length === 0
              ? google.maps.drawing.OverlayType.POLYGON
              : "",
        };

        this.drawingManager = new google.maps.drawing.DrawingManager(options);
        this.drawingManager.setMap(this.map);
        google.maps.event.addListener(
          this.drawingManager,
          "overlaycomplete",
          (event) => {
            // if (event.type === google.maps.drawing.OverlayType.POLYGON) {
            //   const polygon = event.overlay;
            //   const path = polygon
            //     .getPath()
            //     .getArray()
            //     .map((coord) => ({ lat: coord.lat(), lng: coord.lng() }));
            //   console.log("Polygon path:", path);
            //   drawingManager.setDrawingMode(null);
            //   google.maps.event.removeListener(drawingListener);
            // }
            if (event.type === google.maps.drawing.OverlayType.POLYGON) {
              const paths = event.overlay.getPaths();
              console.log("POLYGON1", paths);
              for (let p = 0; p < paths.getLength(); p++) {
                google.maps.event.addListener(paths.getAt(p), "set_at", () => {
                  if (!event.overlay.drag) {
                    this.updatePointList(event.overlay.getPath());
                  }
                });
                google.maps.event.addListener(
                  paths.getAt(p),
                  "insert_at",
                  () => {
                    this.updatePointList(event.overlay.getPath());
                  }
                );
                google.maps.event.addListener(
                  paths.getAt(p),
                  "remove_at",
                  () => {
                    this.updatePointList(event.overlay.getPath());
                  }
                );
              }
              this.updatePointList(event.overlay.getPath());
              this.selectedShape = event.overlay;
              this.selectedShape.type = event.type;
            }
            if (event.type !== google.maps.drawing.OverlayType.MARKER) {
              // Switch back to non-drawing mode after drawing a shape.
              this.drawingManager.setDrawingMode(null);
              // To hide:
              this.drawingManager.setOptions({
                drawingControl: false,
              });
            }
          }
        );
      } else {
        console.error(
          "Geocode was not successful for the following reason: " + status
        );
      }
    });
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });
    }
  }


  deleteSelectedShape() {
    // this.paths = [];

    if (this.selectedShape) {
      this.selectedShape.setMap(null);
      this.selectedArea = 0;
      this.paths = [];
      this.pointList = [];
      // To show:
      this.drawingManager.setOptions({
        drawingControl: true,
      });
    }
    if (this.pointList.length > 0) {
      this.selectedArea = 0;
      this.paths = [];
      this.pointList = [];
      this.polyOptions.setPaths([]);
    }
    this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    this.drawingManager.setOptions({
      drawingControl: true,
      drawingControlOptions: {
        drawingModes: ["polygon"],
      },
    });
  }

  updatePointList(path) {
    this.pointList = [];
    const len = path.getLength();
    for (let i = 0; i < len; i++) {
      this.pointList.push(path.getAt(i).toJSON());
    }
    this.selectedArea = google.maps.geometry.spherical.computeArea(path);
  }

  mapClick(e) {
    if (e.newArr[0].length > 0) {
      this.pointList = e.newArr[0];
    }
  }

  ngOnDestroy(): void {
    this.dialogObservable.unsubscribe();
    this.dataServiceSubscition.unsubscribe();
    if (this.serviceAvailableCityDeleteDialogClose)
      this.serviceAvailableCityDeleteDialogClose.close();
  }

  initializeserviceAvailableCityForm() {
    this.serviceAvailableCityForm = new FormGroup({
      id: new FormControl(""),
      name: new FormControl("", Validators.required),
      country: new FormControl(null, Validators.required),
      state: new FormControl(null, Validators.required),
      city: new FormControl(null, Validators.required),
      cityCenterLat: new FormControl(""),
      cityCenterLon: new FormControl(""),
      customerPrefixCode: new FormControl("", Validators.required),
      partnerPrefixCode: new FormControl("", Validators.required),
      tripPrefixCode: new FormControl("", Validators.required),
      status: new FormControl(false),
    });
    this.apiservice.CommonGetApi("common/list/country").subscribe({
      next: (res) => {
        this.loadMap();
        this.countrys = res.data.countries;
      },
      error: (error) => {
        this.toasterService.danger(error.error.message);
      },
    });
  }

  get name() {
    return this.serviceAvailableCityForm.get("name");
  }
  get country() {
    return this.serviceAvailableCityForm.get("country");
  }
  get state() {
    return this.serviceAvailableCityForm.get("state");
  }
  get city() {
    return this.serviceAvailableCityForm.get("city");
  }
  get dailyReqRadius() {
    return this.serviceAvailableCityForm.get("dailyReqRadius");
  }
  get rentalReqRadius() {
    return this.serviceAvailableCityForm.get("rentalReqRadius");
  }
  get outstationReqRadius() {
    return this.serviceAvailableCityForm.get("outstationReqRadius");
  }
  get cityCenterLat() {
    return this.serviceAvailableCityForm.get("cityCenterLat");
  }
  get cityCenterLon() {
    return this.serviceAvailableCityForm.get("cityCenterLon");
  }
  get approxCityBooundary() {
    return this.serviceAvailableCityForm.get("approxCityBooundary");
  }
  get customerPrefixCode() {
    return this.serviceAvailableCityForm.get("customerPrefixCode");
  }
  get partnerPrefixCode() {
    return this.serviceAvailableCityForm.get("partnerPrefixCode");
  }
  get tripPrefixCode() {
    return this.serviceAvailableCityForm.get("tripPrefixCode");
  }

  patchserviceAvailableCityForm(): void {
    this.dataServiceSubscition = this.dataService
      .getNewRowInfo()
      .subscribe((data) => {
        const rowData: Service_Available_City = data;
        if (JSON.stringify(rowData) !== "{}") {
          let plolyData = rowData.polygon["coordinates"][0].map((el: any) => {
            return { lat: el[1], lng: el[0] };
          });

          this.serviceAvailableCityForm.patchValue({
            id: rowData._id,
            name: rowData.name,
            country: rowData.countryId,
            state: rowData.stateId,
            city: rowData.cityId,
            cityCenterLat: rowData.centerPoint[1],
            cityCenterLon: rowData.centerPoint[0],
            customerPrefixCode: rowData.customerPrefix,
            partnerPrefixCode: rowData.partnerPrefix,
            tripPrefixCode: rowData.tripPrefix,
            status: rowData.status,
          });

          this.paths = plolyData;
          this.pointList = plolyData;
          this.lat = rowData.centerPoint[1];
          this.lng = rowData.centerPoint[0];
          this.countryid();
        } else {
          this.dataFetchWhileReload();
        }
      });
  }

  dataFetchWhileReload() {
    let id = this.ActivatedRoute.snapshot.paramMap.get("id");
    if (id) {
      this.apiservice
        .CommonGetApi("creteria/serviceArea/" + id)
        .subscribe((res) => {
          const data = res.data.serviceZone[0];
          this.dataService.setNewRowInfo(data);
        });
      this.countryid();
    }
  }

  subscribeToMenuItem() {
    this.dialogObservable = this.menuService
      .onItemClick()
      .subscribe((event) => {
        if (
          event.item.title ===
          this.translate.instant(
            "SERVICEAVAILABLECITY.DELETESERVICEAVAILABLECITY"
          )
        ) {
          this.openDeleteDialog(this.deleteDialog);
        }
      });
  }

  countryid() {
    if (this.serviceAvailableCityForm.value.country) {
      this.getStateInitial(this.serviceAvailableCityForm.value.country);
    }
  }

  goBackBtn() {
    this.location.back();
  }

  addOrEditServiceAvailableCity() {
    if (this.serviceAvailableCityForm.invalid) {
      this.serviceAvailableCityForm.markAllAsTouched();
    } else {
      if (
        this.pointList.length > 0 &&
        (this.pointList[0].lat !==
          this.pointList[this.pointList.length - 1].lat ||
          this.pointList[0].lng !==
            this.pointList[this.pointList.length - 1].lng)
      ) {
        // Set the last point as the first point
        this.pointList.push(this.pointList[0]);
      }
      let arrayOfArrays = this.pointList.map((obj) => {
        return [obj.lng, obj.lat];
      });

      const payLoad = {
        name: this.serviceAvailableCityForm.value.name,
        countryId: this.serviceAvailableCityForm.value.country,
        stateId: this.serviceAvailableCityForm.value.state,
        cityId: this.serviceAvailableCityForm.value.city,
        latitude: this.serviceAvailableCityForm.value.cityCenterLat,
        longitude: this.serviceAvailableCityForm.value.cityCenterLon,
        centerPoint: [
          this.serviceAvailableCityForm.value.cityCenterLat,
          this.serviceAvailableCityForm.value.cityCenterLon,
        ],
        customerPrefix: this.serviceAvailableCityForm.value.customerPrefixCode,
        partnerPrefix: this.serviceAvailableCityForm.value.partnerPrefixCode,
        tripPrefix: this.serviceAvailableCityForm.value.tripPrefixCode,
        status: this.serviceAvailableCityForm.value.status,
        polygon: arrayOfArrays,
      };
      if (this.serviceAvailableCityForm.value.id) {
        console.log("PAYLOAD", payLoad);

        this.apiservice
          .CommonPutApi(
            "creteria/serviceArea/" + this.serviceAvailableCityForm.value.id,
            payLoad
          )
          .subscribe({
            next: (res) => {
              const data = res.data;
              this.toasterService.success(res.type, data.message);
            },
            error: (error) => {
              const data = error.error;
              this.toasterService.danger(data.message);
            },
          });
      } else {
        this.apiservice
          .CommonPostApi(payLoad, "creteria/serviceArea")
          .subscribe({
            next: (res) => {
              const data = res.data;
              this.toasterService.success(res.type, data.message);
              this.goBackBtn();
            },
            error: (error) => {
              const data = error.error;
              this.toasterService.danger(data.message);
            },
          });
      }
    }
  }

  deleteServiceAvailableCity() {
    this.apiservice
      .CommonDeleteApi(
        this.serviceAvailableCityForm.value.id,
        "creteria/serviceArea"
      )
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
    if (this.serviceAvailableCityForm.value.state) {
      this.getCityInitial(this.serviceAvailableCityForm.value.state);
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
    this.serviceAvailableCityForm.patchValue({
      state: null,
      city: null,
      cityCenterLat: "",
      cityCenterLon: "",
      customerPrefixCode: "",
      partnerPrefixCode: "",
      tripPrefixCode: "",
      status: false,
    });
  }

  getCityInitial(event) {
    if (event) {
      this.apiservice
        .CommonGetApi(
          "common/list/city/" +
            this.serviceAvailableCityForm.value.country +
            "/" +
            event
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
          "common/list/city/" +
            this.serviceAvailableCityForm.value.country +
            "/" +
            event
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
    this.serviceAvailableCityForm.patchValue({
      city: null,
      cityCenterLat: "",
      cityCenterLon: "",
      customerPrefixCode: "",
      partnerPrefixCode: "",
      tripPrefixCode: "",
      status: false,
    });
  }
  afterCitySelection(event) {
    let citName = this.cities.find((el) => el._id == event);
    console.log(citName)
    // Using citName lat and lng directly
    if (citName.latitude && citName.longitude) {
      if (this.selectedShape) {
        this.selectedShape.setMap(null);
      }
      this.selectedArea = 0;
      this.paths = [];
      this.pointList = [];
      
      // Set the new map center
      const newCenterCoords = { lat: citName.latitude, lng: citName.longitude };
      this.map.setCenter(newCenterCoords);
  
      // Patch the form with the new center coordinates
      this.serviceAvailableCityForm.patchValue({
        cityCenterLat: citName.latitude,
        cityCenterLon: citName.longitude,
      });
      this.deleteSelectedShape()
      this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
      this.drawingManager.setOptions({
        drawingControl: true,
      });
  
      console.log("After city select", citName);
    } else {
      // Handle case where lat/lng is not available in citName
      this.toasterService.danger('City coordinates not available.');
    }
  
    // Reset other form fields
    this.serviceAvailableCityForm.patchValue({
      customerPrefixCode: "",
      partnerPrefixCode: "",
      tripPrefixCode: "",
      status: false,
    });
  }
  

  // afterCitySelection(event) {
  //   let citName = this.cities.find((el) => el._id == event);
  //   console.log(citName)
  //   // this.apiservice.openStreetmapGetApi(citName).subscribe({
  //   //   next: (res) => {
  //   //     if (this.selectedShape) {
  //   //       this.selectedShape.setMap(null);
  //   //     }
  //   //     this.selectedArea = 0;
  //   //     this.paths = [];
  //   //     this.pointList = [];
  //   //     const data = res;
  //   //     let polygonObject = data.find(
  //   //       (e) => e.geojson && e.geojson.type && e.geojson.type == "Polygon"
  //   //     );
  //   //     if (polygonObject["geojson"]["type"] == "Polygon") {
  //   //       let polygonData = polygonObject["geojson"]["coordinates"][0];
  //   //       polygonData = polygonData.map((el) => ({ lat: el[1], lng: el[0] }));
  //   //       console.log("After city select", polygonObject);
  //   //       this.pointList = polygonData;
  //   //       this.polyOptions.setPaths(this.pointList);
  //   //       this.paths = polygonData;
  //   //       this.lat = Number(polygonObject.lat);
  //   //       this.lng = Number(polygonObject.lon);
  //   //       const newCenterCoords = { lat: this.lat, lng: this.lng };
  //   //       this.map.setCenter(newCenterCoords);
  //   //       this.serviceAvailableCityForm.patchValue({
  //   //         cityCenterLat: this.lat,
  //   //         cityCenterLon: this.lng,
  //   //       });
  //   //       this.drawingManager.setDrawingMode(null);
  //   //       this.drawingManager.setOptions({
  //   //         drawingControl: false,
  //   //       });
  //   //     }
  //   //   },
  //   //   error: (error) => {
  //   //     this.toasterService.danger(error.message);
  //   //   },
  //   // });
  //   this.serviceAvailableCityForm.patchValue({
  //     // cityCenterLat: "",
  //     // cityCenterLon: "",
  //     customerPrefixCode: "",
  //     partnerPrefixCode: "",
  //     tripPrefixCode: "",
  //     status: false,
  //   });
  // }

  openDeleteDialog(dialog: TemplateRef<any>) {
    this.serviceAvailableCityDeleteDialogClose = this.dialogService.open(
      dialog,
      {
        autoFocus: false,
        closeOnBackdropClick:
          featuresSettings.Nb_dialogbox_close_while_click_outside,
      }
    );
  }

  deletePopUpData = {
    title: this.translate.instant(
      "SERVICEAVAILABLECITY.DELETESERVICEAVAILABLECITY"
    ),
    data:
      this.translate.instant("COMMON.AREYOUSURE") +
      " " +
      this.translate.instant("SERVICEAVAILABLECITY.SERVICEAVAILABLECITY"),
  };

  closeDeletePopup(event: string) {
    if (event === "close") {
      this.serviceAvailableCityDeleteDialogClose.close();
    } else {
      this.deleteServiceAvailableCity();
    }
  }

  onButtonClick() {
    // Your button click logic here
    console.log("Button clicked!");
  }
}